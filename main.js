require('dotenv').config();
const { app } = require('electron');

// Import all required modules
const DatabaseManager = require('./modules/database/databaseManager');
const WindowManager = require('./modules/window/windowManager');
const APIServer = require('./modules/api/apiServer');
const SerialManager = require('./modules/serial/serialManager');
const IPCManager = require('./modules/ipc/ipcManager');
const ServiceManager = require('./modules/services/serviceManager');
const ProcessCoordinator = require('./modules/coordination/processCoordinator');
const WebsocketManager = require('./modules/websocket/websocketManager');

class Application {
    constructor() {
        this.managers = {};
        this.serviceManager = new ServiceManager();
        this.coordinator = new ProcessCoordinator();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Check service availability and acquire locks
            const serviceStatus = await this.serviceManager.initializeServices(this.managers);
            
            // Acquire locks for services
            const locks = {
                database: await this.coordinator.acquireServiceLock('database'),
                serial: serviceStatus.serialEnabled ? await this.coordinator.acquireServiceLock('serial') : false,
                websocket: serviceStatus.wsEnabled ? await this.coordinator.acquireServiceLock('websocket') : false,
                api: await this.coordinator.acquireServiceLock('api')
            };

            console.log('🔒 Service locks:', locks);

            // Initialize core components
            await this._initializeDatabase();
            this._initializeWindow();

            // Initialize services based on locks and env variables
            await this._initializeServices(locks);
            
            this._setupIPC();
            
            this.isInitialized = true;
            console.log('🚀 Application initialized successfully');
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            await this.cleanup();
            app.quit();
        }
    }

    async _initializeDatabase() {
        this.managers.database = new DatabaseManager();
        await this.managers.database.initialize();
        console.log('✅ Database ready');
    }

    _initializeWindow() {
        this.managers.window = new WindowManager();
        this.managers.window.createWindow();
        console.log('✅ Window ready');
    }

    async _initializeServices(locks) {
        const db = this.managers.database.getDatabase();
        const mainWindow = this.managers.window.getMainWindow();

        // Initialize services based on locks
        if (locks.serial && process.env.USE_SERIAL === 'true') {
            await this._initializeSerial(db, mainWindow);
        }
        
        if (locks.websocket && process.env.USE_WS === 'true') {
            await this._initializeWebSocket(db, mainWindow);
        }

        if (locks.api) {
            this._initializeAPI(db);
        }
        
        console.log('✅ All services ready');
    }

    _initializeAPI(db) {
        this.managers.api = new APIServer(
            db, 
            this.managers.serial, 
            this.managers.websocket
        );
        this.managers.api.start();
    }

    async _initializeSerial(db, mainWindow) {
        this.managers.serial = new SerialManager(db, mainWindow);
        await this.managers.serial.initialize();
    }

    async _initializeWebSocket(db, mainWindow) {
        this.managers.websocket = new WebsocketManager(db, mainWindow);
        await this.managers.websocket.initialize();
    }

    _setupIPC() {
        this.managers.ipc = new IPCManager(
            this.managers.database.getDatabase(),
            this.managers.serial,
            this.managers.websocket
        );
        this.managers.ipc.setupHandlers();
        console.log('✅ IPC handlers ready');
    }

    async cleanup() {
        if (!this.isInitialized) return;
        
        console.log('🔄 Starting cleanup...');
        const cleanupPromises = [];

        // Release all service locks
        this.coordinator.releaseAllLocks();

        // Cleanup services
        if (this.managers.websocket) {
            cleanupPromises.push(this.managers.websocket.cleanup().catch(console.error));
        }
        if (this.managers.serial) {
            cleanupPromises.push(this.managers.serial.close().catch(console.error));
        }
        if (this.managers.api) {
            cleanupPromises.push(this.managers.api.stop().catch(console.error));
        }
        if (this.managers.database) {
            cleanupPromises.push(this.managers.database.close().catch(console.error));
        }

        await Promise.allSettled(cleanupPromises);
        this.isInitialized = false;
        console.log('✅ Cleanup completed');
    }

    getManager(type) {
        return this.managers[type] || null;
    }
}

// Create application instance
const app_instance = new Application();

// Setup event handlers
app.whenReady().then(() => app_instance.initialize());

app.on('window-all-closed', async () => {
    await app_instance.cleanup();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (require('electron').BrowserWindow.getAllWindows().length === 0) {
        app_instance.initialize();
    }
});

// Graceful shutdown handlers
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await app_instance.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await app_instance.cleanup();
    process.exit(0);
});

module.exports = app_instance;
