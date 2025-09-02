# 🌱 IPCC Agricultural Monitoring System

> **Advanced Agricultural IoT Monitoring Framework for Sustainable Farming** - A comprehensive system designed for precision agriculture monitoring with real-time sensor data collection, environmental analysis, and crop management insights.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)]()
[![React](https://img.shields.io/badge/React-18+-blue.svg)]()
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange.svg)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)]()
[![Electron](https://img.shields.io/badge/Electron-Desktop-lightblue.svg)]()
[![IoT](https://img.shields.io/badge/IoT-Sensors-brightgreen.svg)]()

## 🚀 What Makes This Agricultural System Special?

Transform your farming operations with cutting-edge IoT monitoring technology. This framework brings together precision agriculture, environmental monitoring, and data-driven insights:

- **🌾 Crop-Specific Monitoring**: Specialized dashboards for Nipis Lime and Kasturi Lime cultivation
- **📊 Real-time Sensor Data**: Temperature, humidity, soil conditions, and environmental monitoring
- **🔄 Dual Database Support**: Switch between MySQL and Firebase for scalable data storage
- **⚡ Live Data Streaming**: WebSocket communications for instant updates
- **🌦️ Weather Integration**: 5-day weather forecasting for agricultural planning
- **🗺️ Land Plot Visualization**: Interactive maps with Google Maps integration
- **🖥️ Desktop & Web**: Cross-platform support with Electron and React web interface

## 🏗️ Agricultural IoT System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│           🌱 IPCC Agricultural Monitoring System                    │
├──────────────┬──────────────────┬─────────────────┬────────────────┤
│ 🎨 Frontend  │ 📊 Data Layer    │ 🔌 IoT Layer   │ 🌐 Services   │
│ Interface    │                  │                 │                │
├──────────────┼──────────────────┼─────────────────┼────────────────┤
│ React Web    │ MySQL Database   │ Arduino/ESP32   │ REST API       │
│ Electron App │ Firebase Store   │ Sensor Networks │ WebSocket      │
│ Dashboard    │ Real-time Sync   │ Serial Comm     │ Weather API    │
│ Charts       │ Query Builder    │ Auto-reconnect  │ Google Maps    │
└──────────────┴──────────────────┴─────────────────┴────────────────┘

🌾 Specialized Agricultural Components:
├── Nipis Lime Monitoring Dashboard
├── Kasturi Lime Monitoring Dashboard  
├── Environmental Sensor Management
├── Weather Forecast Integration
├── Land Plot Mapping & Visualization
└── Production Analytics & Reporting
```

## 📁 **Project Structure - Agricultural System Organization**

Understanding the project structure is essential for developing and maintaining this agricultural monitoring system:

```
IPCC_Framework/
├── 📋 main.js                          # 🚀 Electron main process - Application orchestrator
├── 🔗 preload.js                       # 🌉 Security bridge between frontend and backend
├── 📦 package.json                     # 📋 Dependencies and npm scripts
├── 🔐 .env                            # ⚙️ Environment configuration
├── 🐳 docker-compose.yml              # 🐳 Docker containerization setup
├── 🔥 firebase.json                   # 🔥 Firebase project configuration
│
├── 📂 src/                            # 🎨 React Frontend Application
│   ├── 📱 App.js                      # 🎯 Main React application component
│   ├── 📂 components/                 # 🧩 React UI Components
│   │   ├── 📂 dashboard/              # 📊 Dashboard Views
│   │   │   ├── 🍋 NipisOverview.jsx   # Nipis Lime monitoring dashboard
│   │   │   ├── 🟢 KasturiOverview.jsx # Kasturi Lime monitoring dashboard
│   │   │   ├── 📈 Data.jsx            # Data analytics page
│   │   │   ├── 💰 Finance.jsx         # Financial analysis
│   │   │   ├── 🔧 Maintenance.jsx     # Equipment maintenance
│   │   │   └── 🌤️ Forecast.jsx        # Weather forecasting
│   │   │
│   │   ├── 📂 ui/                     # 🎨 Reusable UI Components
│   │   │   ├── 🚨 Alerts.jsx          # Alert notifications system
│   │   │   ├── 🗺️ LandPlotMaps.jsx    # Google Maps integration
│   │   │   ├── 📊 MetricCard.jsx      # Metric display cards
│   │   │   ├── 🌿 PlantInfo.jsx       # Plant information display
│   │   │   └── 💡 FarmingSuggestions.jsx # AI farming recommendations
│   │   │
│   │   ├── 📂 charts/                 # 📈 Chart Components
│   │   │   ├── 📊 sensorChart.jsx     # Real-time sensor data charts
│   │   │   ├── 📈 lineChart.jsx       # Time series line charts
│   │   │   └── 🥧 pieChart.jsx        # Distribution pie charts
│   │   │
│   │   └── 📂 layout/                 # 🏗️ Layout Components
│   │       ├── 🎯 header.jsx          # Application header
│   │       ├── 📋 sidebar.jsx         # Navigation sidebar
│   │       └── 📄 mainContent.jsx     # Main content wrapper
│   │
│   └── 📂 hook/                       # 🎣 Custom React Hooks
│       ├── 🔌 useApi.js               # API integration hook
│       ├── 🔥 useFirestore.js         # Firestore database hook
│       └── ⚡ useRealtimeData.js      # Real-time data streaming hook
│
├── 📂 modules/                        # 🧩 Backend Service Modules
│   ├── 📂 database/                   # 💾 Database Management
│   ├── 📂 serial/                     # 🔌 IoT Sensor Communication  
│   ├── 📂 websocket/                  # ⚡ Real-time Data Streaming
│   ├── 📂 api/                        # 🌐 REST API Server
│   └── 📂 services/                   # 🛠️ Background Services
│
├── 📂 lib/                            # 🏗️ Core Libraries
│   ├── 📂 db/                         # 🗄️ Database Abstraction
│   │   ├── mysqlDB.js                 # MySQL integration
│   │   ├── firebaseDB.js              # Firebase integration
│   │   └── firestoreDB.js             # Firestore integration
│   │
│   └── 📂 com/                        # 📡 Communication Libraries
│       ├── serialCommunicator.js      # Arduino/ESP32 communication
│       └── webSocketCommunicator.js   # Real-time data broadcasting
│
├── 📂 App/Http/Controllers/           # 🎮 Backend Controllers
│   ├── authController.js              # Authentication & authorization
│   ├── databaseController.js          # Database operations
│   └── mauiController.js              # Mobile API endpoints
│
├── 📂 scripts/                        # 🔧 Utility Scripts
│   ├── env-manager.js                 # Environment management
│   ├── switch-db.js                   # Database switching
│   ├── seed-database.js               # Database seeding
│   └── setup-web.js                   # Web setup automation
│
└── 📂 public/                         # 🌐 Static Web Assets
    ├── index.html                     # Web app entry point
    └── manifest.json                  # PWA configuration
```

## 🎯 **File Purpose Guide - Know What You're Editing**

### 🚀 **Core Application Files**

#### `main.js` - The Orchestrator (NEW MODULAR APPROACH!)
```javascript
// 🎯 Purpose: Simplified application bootstrap using modular components
// ✏️ Edit when: Adding new modules, changing initialization order, app-wide config
// 🔧 Contains: Module orchestration, lifecycle management, error handling

// Key sections to modify:
class Application {
    async initialize() {
        // Add new module initializations here
        this.databaseManager = new DatabaseManager();
        this.windowManager = new WindowManager();
        this.apiServer = new APIServer();
        // Add your custom modules here
    }
}
```

### 🧩 **Modular Components (`modules/`)**

#### `modules/database/databaseManager.js` - Database Orchestrator
```javascript
// 🎯 Purpose: Centralized database initialization and management
// ✏️ Edit when: Adding database configurations, switching logic, connection pooling
// 🔧 Contains: Database initialization, connection management, cleanup

class DatabaseManager {
    async initialize() {
        // Add custom database initialization logic
        if (this.useFirebase) {
            this.db = new FirebaseDB(/* config */);
        } else {
            this.db = new Database(/* config */);
            await this.db.connect();
        }
    }
    
    // Add custom database management methods
    async switchDatabase(type) { /* switching logic */ }
    async healthCheck() { /* health monitoring */ }
}
```

#### `modules/window/windowManager.js` - Window Controller
```javascript
// 🎯 Purpose: Electron window lifecycle and configuration management
// ✏️ Edit when: Changing window properties, adding new windows, menu customization
// 🔧 Contains: Window creation, configuration, event handling

class WindowManager {
    createWindow() {
        // Modify window configuration
        this.mainWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            // Add custom window options
        });
        
        // Add custom window event handlers
        this.mainWindow.on('custom-event', this.handleCustomEvent);
    }
    
    // Add new window management methods
    createSecondaryWindow() { /* additional windows */ }
    toggleFullscreen() { /* window controls */ }
}
```

#### `modules/api/apiServer.js` - API Orchestrator
```javascript
// 🎯 Purpose: Express server setup, middleware, and route organization
// ✏️ Edit when: Adding new routes, middleware, authentication, API versioning
// 🔧 Contains: Server configuration, route setup, controller initialization

class APIServer {
    setupRoutes() {
        // Add new API routes
        this.app.post('/api/v2/sensors', sensorController.createSensor);
        this.app.get('/api/admin/stats', authMiddleware, adminController.getStats);
        
        // Add custom middleware
        this.app.use('/api/secure', this.authenticateMiddleware);
    }
    
    // Add server management methods
    addRoute(method, path, handler) { /* dynamic routing */ }
    enableCORS(origins) { /* CORS configuration */ }
}
```

#### `modules/serial/serialManager.js` - Hardware Communication Hub
```javascript
// 🎯 Purpose: Serial communication orchestration and device management
// ✏️ Edit when: Adding device types, communication protocols, data parsing
// ✏️ Contains: Serial configuration, connection management, data handling

class SerialManager {
    async initialize() {
        // Configure serial communication
        this.serialCommunicator = new SerialCommunicator(
            this.config, 
            this.database, 
            this.mainWindow
        );
        
        // Add custom device handlers
        this.setupDeviceHandlers();
    }
    
    // Add device-specific methods
    handleArduinoData(data) { /* Arduino-specific parsing */ }
    handleESP32Data(data) { /* ESP32-specific parsing */ }
    addCustomDevice(config) { /* dynamic device addition */ }
}
```

#### `modules/ipc/ipcManager.js` - Frontend-Backend Bridge
```javascript
// 🎯 Purpose: Organized IPC handler management and frontend communication
// ✏️ Edit when: Adding new frontend-backend communications, data channels
// 🔧 Contains: IPC handler organization, channel management, data validation

class IPCManager {
    setupHandlers() {
        this.setupDatabaseHandlers();
        this.setupSerialHandlers();
        this.setupCustomHandlers(); // Add your custom handlers
    }
    
    setupCustomHandlers() {
        // Add new IPC handlers
        ipcMain.handle('custom-operation', async (event, data) => {
            // Your custom backend operation
            return { success: true, result: processedData };
        });
    }
    
    // Add handler categories
    setupFileHandlers() { /* file operations */ }
    setupSystemHandlers() { /* system operations */ }
}
```

### 🏗️ **Core Framework Libraries (`lib/`)**

#### `lib/db/mysqlDB.js` - MySQL Powerhouse
```javascript
// 🎯 Purpose: MySQL database operations with advanced Query Builder
// ✏️ Edit when: Adding custom query methods, modifying encryption, adding validations
// 🔧 Contains: Connection management, Query Builder class, encryption utilities

// Key sections to modify:
class QueryBuilder {
    // Add custom query methods here
    whereTemperature(min, max) { /* custom filtering */ }
    withSensorData() { /* join sensor tables */ }
}

class Database {
    encrypt(text) { /* modify encryption logic */ }
    validate(data, rules) { /* add validation rules */ }
}
```

#### `lib/db/firebaseDB.js` - Firebase Magic
```javascript  
// 🎯 Purpose: Firebase Realtime Database with MySQL-compatible Query Builder
// ✏️ Edit when: Adding Firebase-specific optimizations, custom query methods
// 🔧 Contains: Firebase connection, Query Builder for NoSQL, data transformation

// Key sections to modify:
class FirebaseQueryBuilder {
    // Add Firebase-specific query methods
    _applyClientFilters(data) { /* custom filtering logic */ }
    whereFirebaseSpecific(field, value) { /* Firebase optimizations */ }
}
```

#### `lib/com/serialCommunicator.js` - Hardware Whisperer
```javascript
// 🎯 Purpose: Smart serial device communication with auto-reconnection
// ✏️ Edit when: Supporting new device types, changing data parsing, adding protocols
// 🔧 Contains: Port management, data parsing, reconnection logic

// Key sections to modify:
_handleData(rawString) {
    // Add new data format parsing
    switch (this.config.dataType) {
        case 'your-custom-format':
            // Your parsing logic here
    }
}

_autoDetectAndConnect() {
    // Add new device detection patterns
    const potentialPorts = ports.filter(p => {
        // Add your device identifiers
    });
}
```

#### `lib/com/webSocketHandler.js` - Real-time Maestro
```javascript
// 🎯 Purpose: WebSocket server for real-time data broadcasting  
// ✏️ Edit when: Adding authentication methods, custom message types, client management
// 🔧 Contains: Client management, message routing, authentication

// Key sections to modify:
_handleClientMessage(ws, clientData, rawData) {
    switch (message.type) {
        case 'your-custom-type':
            this._handleYourCustomType(ws, clientData, message);
            break;
    }
}

_validateSensorData(data) {
    // Add custom validation logic
}
```

### 🎮 **Controllers (`controller/app/`)**

#### `authController.js` - Security Guardian
```javascript
// 🎯 Purpose: User authentication, JWT tokens, security middleware
// ✏️ Edit when: Adding new auth methods, changing token policies, adding user roles
// 🔧 Contains: Login/register logic, JWT generation, middleware

// Key sections to modify:
const authController = {
    login: async (req, res) => {
        // Add custom login logic
        // Add multi-factor authentication
        // Add OAuth integration
    },
    
    register: async (req, res) => {
        // Add custom registration validation
        // Add email verification
        // Add user role assignment
    }
};
```

#### `databaseController.js` - Data Operations Center
```javascript
// 🎯 Purpose: Generic database operations exposed to REST API
// ✏️ Edit when: Adding data validation, custom endpoints, data transformations
// 🔧 Contains: CRUD operations, data validation, error handling

// Key sections to modify:
const dbController = {
    insertSensorData: async (req, res) => {
        // Add custom data validation
        // Add data transformation
        // Add business logic
    }
};
```

#### `mauiController.js` - Mobile Integration Hub
```javascript
// 🎯 Purpose: Handle requests from MAUI/mobile applications
// ✏️ Edit when: Adding mobile-specific endpoints, data formatting for mobile
// 🔧 Contains: Mobile-optimized responses, data formatting

// Key sections to modify:
const mauiController = {
    genericDataHandler: async (req, res) => {
        // Add mobile-specific data processing
        // Add response optimization for mobile
    }
};
```

### 🎨 **Frontend (`resource/view/uibaru/`)**

#### `monitor.html` - Dashboard Canvas
```html
<!-- 🎯 Purpose: Main monitoring interface structure -->
<!-- ✏️ Edit when: Adding new UI components, changing layout, adding charts -->
<!-- 🔧 Contains: Dashboard structure, component containers, script includes -->

<!-- Key sections to modify: -->
<div id="sensor-dashboard">
    <!-- Add new dashboard components here -->
</div>

<div id="connection-status">
    <!-- Modify connection indicators -->
</div>
```

#### `script.js` - Frontend Brain
```javascript
// 🎯 Purpose: Frontend logic, real-time updates, user interactions
// ✏️ Edit when: Adding UI interactions, handling new data types, adding charts
// 🔧 Contains: Real-time data handling, UI updates, event listeners

// Key sections to modify:
api.receive('serial-data-received', (data) => {
    // Add custom data visualization
    // Add real-time chart updates
    // Add data filtering/processing
});

function updateDashboard(data) {
    // Add new dashboard update logic
    // Add data validation
    // Add user notifications
}
```

#### `style.css` - Visual Magic
```css
/* 🎯 Purpose: Dashboard styling and responsive design */
/* ✏️ Edit when: Changing visual design, adding new components, improving UX */
/* 🔧 Contains: Dashboard styling, animations, responsive layouts */

/* Key sections to modify: */
.sensor-card {
    /* Modify sensor display cards */
}

.connection-indicator {
    /* Modify connection status styling */
}

@media (max-width: 768px) {
    /* Add mobile responsive design */
}
```

### ⚙️ **Configuration Files**

#### `.env` - Your Secret Vault
```env
# 🎯 Purpose: Environment-specific configuration and secrets
# ✏️ Edit when: Changing database connections, API keys, feature toggles
# 🔧 Contains: Database configs, API keys, feature flags

# Key sections to modify:
USE_FIREBASE=false              # Toggle database type
MYSQL_HOST=localhost            # Change database connection
SERIAL_PORT=COM3               # Configure serial port
WS_PORT=8080                   # Change WebSocket port
DB_ENCRYPTION_KEY=YourKey      # Update encryption key
```

#### `firebaseConfig.js` - Firebase Defaults
```javascript
// 🎯 Purpose: Default Firebase configuration values
// ✏️ Edit when: Setting up Firebase project, changing default values
// 🔧 Contains: Firebase project configuration

module.exports = {
    apiKey: "your-default-api-key",
    authDomain: "your-project.firebaseapp.com",
    // Add your Firebase project details
};
```

## 🎯 **Common Editing Scenarios with Modular Approach**

### 🔌 **Adding a New Serial Device Type**
1. **Edit `modules/serial/serialManager.js`**: Add device-specific configuration and handlers
2. **Edit `lib/com/serialCommunicator.js`**: Add device detection in `_autoDetectAndConnect()`
3. **Edit `.env`**: Add device-specific configuration options
4. **Edit `resource/view/uibaru/script.js`**: Add frontend handling for new device data

### 📊 **Adding a New Dashboard Widget**
1. **Edit `resource/view/uibaru/monitor.html`**: Add widget HTML structure
2. **Edit `resource/view/uibaru/style.css`**: Add widget styling
3. **Edit `resource/view/uibaru/script.js`**: Add widget update logic
4. **Edit `modules/ipc/ipcManager.js`**: Add IPC handler if backend data needed

### 🗄️ **Adding a New Database Table/Operations**
1. **Edit `lib/db/mysqlDB.js` or `lib/db/firebaseDB.js`**: Add custom query methods
2. **Edit `controller/app/databaseController.js`**: Add REST endpoints
3. **Edit `modules/api/apiServer.js`**: Add new routes
4. **Edit `modules/ipc/ipcManager.js`**: Add IPC handlers
5. **Edit `preload.js`**: Expose new methods to frontend

### 🔐 **Modifying Authentication**
1. **Edit `controller/app/authController.js`**: Modify login/register logic
2. **Edit `modules/api/apiServer.js`**: Update API authentication middleware
3. **Edit `lib/com/webSocketHandler.js`**: Update WebSocket authentication
4. **Edit `.env`**: Add new auth configuration options

### 🌐 **Adding New WebSocket Message Types**
1. **Edit `lib/com/webSocketHandler.js`**: Add message type handler
2. **Edit `resource/view/uibaru/script.js`**: Add frontend message listener
3. **Edit `preload.js`**: Add receive channel if needed

### 🧩 **Creating a New Custom Module**
1. **Create `modules/yourmodule/yourManager.js`**: Implement your module class
2. **Edit `main.js`**: Add module to application initialization
3. **Add module-specific configuration** to `.env`
4. **Connect to other modules** as needed through the main application class

## 💡 **Benefits of the New Modular Structure**

### 🎯 **Better Organization**
- **Cleaner main.js**: From 300+ lines to ~60 lines of orchestration code
- **Focused modules**: Each module handles one specific responsibility
- **Easier navigation**: Find exactly what you need without hunting through large files

### 🔧 **Enhanced Maintainability**
- **Isolated changes**: Modify database logic without touching serial communication
- **Independent testing**: Test each module in isolation
- **Clearer dependencies**: See exactly what each module needs

### 🚀 **Improved Performance**
- **Same runtime performance**: No additional overhead compared to monolithic structure
- **Better memory management**: Modules can be garbage collected independently
- **Faster development**: Smaller files load and process faster in IDEs

### 📈 **Scalability Ready**
- **Easy module addition**: Add new functionality without touching existing code
- **Pluggable architecture**: Swap implementations easily (e.g., different databases)
- **Team development**: Multiple developers can work on different modules simultaneously

This modular approach gives you complete control over every aspect of your monitoring system while maintaining the same powerful functionality you had before - just organized in a way that scales with your project's growth!

## 🎯 Quick Start - Get Your Agricultural Monitoring Running!

### 1. **Clone & Install**
```bash
git clone <your-repo>
cd IPCC_Framework
npm install
```

### 2. **Choose Your Database for Agricultural Data**
```bash
# For local MySQL deployment (recommended for on-farm systems)
npm run switch-db mysql

# For cloud Firebase deployment (recommended for remote monitoring)
npm run switch-db firebase
```

### 3. **Configure Your Agricultural Environment**
Copy `.env.example` to `.env` and configure for your farm setup:

```env
# 🌾 Agricultural System Configuration
APP_NAME=IPCC Agricultural Monitoring
NODE_ENV=production

# 🎛️ Database Selection for Farm Data
USE_FIREBASE=false                    # Toggle between MySQL/Firebase

# 🔧 MySQL Configuration (Local Farm Database)
MYSQL_HOST=localhost
MYSQL_USER=ipcc_farm_user
MYSQL_PASSWORD=your_secure_farm_password
MYSQL_DATABASE=ipcc_agricultural_db

# 🔥 Firebase Configuration (Cloud Agricultural Data)
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=ipcc-agricultural-system
FIREBASE_DATABASE_URL=https://ipcc-5fa54-default-rtdb.firebaseio.com

# 🌐 Real-time Agricultural Data Streaming
WS_PORT=8080
WS_AUTH_ENABLED=false
WS_MAX_CONNECTIONS=50

# 🔌 IoT Sensor Communication for Farm Monitoring
SERIAL_PORT=COM3                     # Windows: Arduino/ESP32 connection
# SERIAL_PORT=/dev/ttyUSB0           # Linux: Sensor device connection
SERIAL_BAUDRATE=9600
SENSOR_DATA_INTERVAL=10000           # 10 seconds for live updates

# 🌦️ Weather API for Agricultural Planning  
WEATHER_API_KEY=your_weather_api_key
WEATHER_LOCATION=your_farm_coordinates

# 🗺️ Google Maps for Land Plot Visualization
GOOGLE_MAPS_API_KEY=your_google_maps_key

# 🔐 Security for Agricultural Data
DB_ENCRYPTION_KEY=ipcc-secure-key-2024-agricultural-monitoring-system
JWT_SECRET=ipcc-jwt-secret-key-for-authentication-2024
```

### 4. **Launch Your Agricultural Monitoring System**
```bash
# Start the complete system (Electron + Web + Services)
npm run start:both

# Or start individual components:
npm run start:web            # React web interface only
npm run start:electron       # Electron desktop app only  
npm run dev                  # Development mode with hot reload
```

### 5. **Available Running Modes**
```bash
# Development with hot reload
npm run dev

# Web-only deployment (for remote access)
npm run dev:web

# Desktop-only (for on-farm monitoring stations)  
npm run dev:electron

# Production deployment
npm run serve:web
```

## 🌾 Agricultural Features That Transform Farming

### 🗄️ **Agricultural Data Management**

**Dual Database Support** - Perfect for farm operations:

```javascript
// Same code works with both MySQL and Firebase for agricultural data
const sensorReadings = await db.table('sensors')
    .where('sample_id', 'like', '%nipis%')
    .where('timestamp', '>', '2024-01-01')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();

// Works seamlessly with both database systems! 🌱
```

**Agricultural Query Builder:**
```javascript
// Monitor environmental conditions
const environmentalData = await db.table('sensors')
    .where({ active: true, location: 'greenhouse_1' })
    .whereBetween('temperature', 20, 35)
    .whereBetween('humidity', 60, 80)
    .orderByDesc('timestamp')
    .limit(50)
    .get();

// Track crop-specific data with joins
const cropAnalytics = await db.table('sensors')
    .leftJoin('crops', 'sensors.sample_id', 'crops.id')
    .select(['sensors.*', 'crops.variety', 'crops.planting_date'])
    .where('crops.type', 'citrus')
    .get();
```

### 🔌 **IoT Agricultural Sensor Communication**

**Smart Farm Device Detection:**
- 🌱 Automatically detects agricultural sensors (Arduino/ESP32)
- 🔄 Self-healing connections for uninterrupted crop monitoring
- 🎯 Dynamic switching between sensor networks
- 📡 Real-time updates to farming dashboards

```javascript
// Agricultural sensor communication setup
const farmSensorComm = new SerialCommunicator({
    baudRate: 9600,
    autoReconnect: true,
    dataType: 'json-object',
    dbTableName: 'sensor_data',           // Agricultural sensor readings
    cropType: 'nipis',                    // Crop-specific configuration
    sampleId: 'nipis_greenhouse_01'       // Plot identification
}, db, mainWindow);

// Connects to your farm sensors automatically
await farmSensorComm.connect();
```

**Agricultural Data Format Support:**
```javascript
// Nipis Lime environmental data
// JSON: {"temperature": 28.5, "humidity": 75, "soil_moisture": 60, "ph": 6.2}
// CSV: "28.5,75,60,6.2,nipis_plot_01"
// Custom: "TEMP:28.5|HUM:75|SOIL:60|PH:6.2|PLOT:nipis_01"
```

### 🍋 **Crop-Specific Dashboard Features**

**Nipis Lime Monitoring Dashboard:**
- 🌡️ **Temperature & Humidity**: Optimal growing conditions (22-30°C, 60-80%)
- 💧 **Soil Moisture**: Real-time irrigation monitoring
- 📊 **Growth Analytics**: Plant development tracking
- 🌦️ **Weather Integration**: 5-day forecast for agricultural planning
- 🗺️ **Plot Mapping**: Google Maps integration with sensor locations
- 📈 **Production Analytics**: Harvest prediction and yield optimization

**Kasturi Lime Monitoring Dashboard:**
- 🟢 **Specialized Metrics**: Tailored for Kasturi lime requirements
- 🌿 **Plant Health**: Disease detection and prevention alerts
- 💰 **Financial Analytics**: Cost analysis and profit projections
- 🔧 **Maintenance Scheduling**: Equipment and irrigation system management

```javascript
// Dynamic dashboard routing based on sample_id
const DynamicOverview = () => {
    const sensorsData = useFirestore('sensors', {
        orderBy: { field: 'timestamp', direction: 'desc' },
        limit: 1
    });
    
    // Automatically routes to appropriate dashboard
    if (sampleId.toLowerCase().includes('nipis')) {
        return <NipisOverview />;
    } else {
        return <KasturiOverview />;
    }
};
```

### 🌐 **Real-time Agricultural Data Streaming**

**Live Farm Monitoring:**
```javascript
const agriculturalWS = new WebSocketHandler({
    port: 8080,
    enableAuthentication: false,
    maxConnections: 50,
    farmMode: true                      // Agricultural-specific mode
}, db, mainWindow);

// Broadcast real-time agricultural data
agriculturalWS.broadcastToAll({
    type: 'crop_sensor_update',
    data: { 
        temperature: 28.5, 
        humidity: 75,
        soil_moisture: 65,
        crop_type: 'nipis',
        plot_id: 'greenhouse_01',
        timestamp: new Date() 
    }
});

// Weather alert broadcasting
agriculturalWS.broadcastWeatherAlert({
    type: 'weather_warning',
    severity: 'high',
    message: 'Heavy rain expected - secure irrigation systems',
    forecast: weatherData
});
```

**Client Management:**
- 🔐 Optional authentication with auto-generated tokens
- 💓 Heartbeat monitoring to detect dead connections
- 📊 Real-time client statistics and monitoring
- 🚦 Connection limiting and overflow protection

### 🚀 **REST API - External Integration Ready**

```javascript
// Clean, simple API endpoints
app.post('/api/sensor-data', async (req, res) => {
    const result = await db.table('sensors')
        .insert(req.body);
    res.json({ success: true, id: result.insertId });
});

// Built-in authentication
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
```

### 🛡️ **Security - Your Data's Bodyguard**

**Encryption That Actually Works:**
```javascript
// Automatic field encryption
const sensitiveData = {
    username: 'john_doe',
    email: 'john@example.com',    // Will be encrypted
    password: 'secret123',        // Will be encrypted
    public_info: 'not sensitive'  // Stays plain
};

await db.table('users').insert(sensitiveData);
// Email and password are automatically encrypted!
```

## 🎛️ **Configuration - Tailor It to Your Needs**

### Database Switching Made Effortless
```bash
# Switch to MySQL
npm run switch-db mysql

# Switch to Firebase  
npm run switch-db firebase

# Check current database
npm run check-db
```

### Environment Variables - Your Control Panel
```env
# 🎯 Core Settings
USE_FIREBASE=false                    # The big switch
API_PORT=3001                        # Your API lives here

# 🔌 Serial Communication
SERIAL_PORT=null                     # Auto-detect magic
SERIAL_BAUDRATE=9600                 # Standard baud rate
SERIAL_DATA_TYPES=json-object        # How your device talks
SERIAL_DB_TABLE_NAME=sensors         # Where data lands

# 🌐 WebSocket Configuration
WS_PORT=8080                         # Real-time data port
WS_AUTH_ENABLED=false               # Keep it simple
WS_MAX_CONNECTIONS=10               # Control the crowd
WS_HEARTBEAT_INTERVAL=30000         # Keep connections alive

# 🔐 Security
DB_ENCRYPTION_KEY=YourSecretKey     # Lock it down
```

## 🎨 **Frontend Integration - Seamless Connection**

Your frontend gets superpowers through the preload bridge:

```javascript
// In your renderer process
const api = window.api;

// Database operations
const sensors = await api.getDataByFilters('sensors', 
    { active: true }, 
    { orderBy: 'timestamp DESC', limit: 100 }
);

// Serial communication
const status = await api.getSerialStatus();
await api.forceReconnect();
await api.sendData('RESET_SENSORS');

// Real-time data listening
api.receive('serial-data-received', (data) => {
    console.log('New sensor data:', data);
    updateDashboard(data);
});

api.receive('database-insert-success', (result) => {
    console.log('Data saved:', result);
    showNotification('Data saved successfully!');
});
```

## 🏁 **Real-World Example - Putting It All Together**

Let's build a temperature monitoring system:

```javascript
// 1. Setup your serial communicator for temperature sensors
const tempSensor = new SerialCommunicator({
    baudRate: 9600,
    dataType: 'json-object',
    dbTableName: 'temperature_readings',
    requiredFields: ['temperature', 'humidity'],
    fieldsToEncrypt: ['location']  // Keep sensor locations private
}, db, mainWindow);

// 2. Start your WebSocket server for real-time updates
const wsServer = new WebSocketHandler({
    port: 8080,
    enableAuthentication: true,
    dbTableName: 'temperature_readings'
}, db, mainWindow);

// 3. Connect everything
await tempSensor.connect();        // Auto-finds your Arduino
await wsServer.start();           // Starts real-time server

// 4. Your Arduino sends: {"temperature": 25.5, "humidity": 60, "location": "Lab1"}
// Framework automatically:
// - Receives and validates the data
// - Encrypts the location field  
// - Saves to your chosen database
// - Broadcasts to all WebSocket clients
// - Updates your Electron interface
```

## 🔧 **Advanced Features - For the Power Users**

### Custom Query Builder Extensions
```javascript
// Add your own query methods
QueryBuilder.prototype.whereTemperature = function(min, max) {
    return this.whereBetween('temperature', min, max);
};

// Use your custom methods
const hotReadings = await db.table('sensors')
    .whereTemperature(30, 50)
    .whereNotNull('humidity')
    .get();
```

### Serial Communication Events
```javascript
serialComm.on('data', (data) => {
    console.log('Raw data received:', data);
});

serialComm.on('connection-lost', (info) => {
    console.log('Connection lost, attempting reconnection...');
    showAlert('Sensor disconnected, reconnecting...');
});

serialComm.on('better-port-detected', (portInfo) => {
    console.log('Found better port:', portInfo.newPort);
    showNotification(`Switching to better connection: ${portInfo.newPort}`);
});
```

## 🐛 **Troubleshooting - We've Got Your Back**

### Common Issues & Solutions

**Serial Port Not Found?**
```bash
# Windows: Check Device Manager
# Linux: List available ports
ls /dev/tty*

# Enable dynamic port switching
SERIAL_ENABLE_DYNAMIC_SWITCHING=true
```

**Database Connection Issues?**
```javascript
// Check your connection
const status = await db.raw('SELECT 1 as test');
console.log('Database OK:', status);

// Switch databases easily
npm run switch-db firebase  # Try Firebase instead
```

**WebSocket Not Connecting?**
```javascript
// Check server status
const wsStatus = wsHandler.getStatus();
console.log('WebSocket Server:', wsStatus);

// Verify port availability
netstat -an | grep :8080
```

## 🎯 **Best Practices - Do It Right**

### 1. **Error Handling Like a Pro**
```javascript
try {
    const result = await db.table('sensors')
        .where('active', true)
        .get();
} catch (error) {
    console.error('Database error:', error.message);
    // Always handle your errors gracefully
    showUserFriendlyMessage('Unable to load sensor data');
}
```

### 2. **Security First**
```javascript
// Always validate incoming data
const validateSensorData = (data) => {
    const required = ['temperature', 'timestamp'];
    return required.every(field => data[field] !== undefined);
};

// Encrypt sensitive fields
const sensitiveSensors = ['location', 'device_id', 'user_id'];
```

### 3. **Performance Optimization**
```javascript
// Use indexes for frequently queried fields
// Limit data retrieval for real-time updates
const recentData = await db.table('sensors')
    .where('timestamp', '>', lastUpdate)
    .limit(100)
    .get();
```

## 🚀 **Deployment - Take It Live**

### Development Mode
```bash
npm run dev          # Hot reloading for development
```

### Production Build
```bash
npm run build        # Optimized production build
npm run start:prod   # Run in production mode
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001 8080
CMD ["npm", "start"]
```

### 🗺️ **Google Maps Integration for Land Plot Management**

```javascript
// Interactive farm plot visualization
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const LandPlotsMap = () => {
    const [selectedPlot, setSelectedPlot] = useState(null);
    
    return (
        <GoogleMap
            center={{ lat: -6.200000, lng: 106.816666 }}  // Indonesia coordinates
            zoom={15}
            mapContainerStyle={{ height: '400px', width: '100%' }}
        >
            {farmPlots.map(plot => (
                <Marker
                    key={plot.id}
                    position={plot.coordinates}
                    onClick={() => setSelectedPlot(plot)}
                    icon={{
                        url: plot.crop_type === 'nipis' ? nipisIcon : kasturiIcon,
                        scaledSize: new window.google.maps.Size(32, 32)
                    }}
                />
            ))}
            
            {selectedPlot && (
                <InfoWindow
                    position={selectedPlot.coordinates}
                    onCloseClick={() => setSelectedPlot(null)}
                >
                    <div>
                        <h3>{selectedPlot.name}</h3>
                        <p>Crop: {selectedPlot.crop_type}</p>
                        <p>Temperature: {selectedPlot.current_temp}°C</p>
                        <p>Humidity: {selectedPlot.current_humidity}%</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};
```

### 🌦️ **Weather Forecasting for Agricultural Planning**

```javascript
// 5-day weather forecast integration
const WeatherForecast = () => {
    const [weatherData, setWeatherData] = useState(null);
    
    useEffect(() => {
        // Fetch weather data for farm location
        fetchWeatherForecast(farmCoordinates)
            .then(data => setWeatherData(data));
    }, []);
    
    return (
        <div className="weather-forecast-grid">
            {weatherData?.daily?.map((day, index) => (
                <div key={index} className="weather-day-card">
                    <WeatherIcon code={day.weather_code} />
                    <div className="temperature-range">
                        <span className="max-temp">{day.temperature_2m_max}°C</span>
                        <span className="min-temp">{day.temperature_2m_min}°C</span>
                    </div>
                    <div className="precipitation">
                        <CloudRain className="w-4 h-4" />
                        <span>{day.precipitation_sum}mm</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
```

## 📊 **Available Dashboard Components**

### 🎯 **Core Agricultural Components**
- **NipisOverview.jsx**: Specialized dashboard for Nipis Lime monitoring
- **KasturiOverview.jsx**: Dedicated dashboard for Kasturi Lime cultivation  
- **Data.jsx**: Comprehensive data analytics and historical trends
- **Finance.jsx**: Agricultural financial analysis and cost tracking
- **Maintenance.jsx**: Equipment maintenance scheduling and tracking
- **Forecast.jsx**: Weather forecasting and agricultural planning

### 🧩 **Reusable UI Components**
- **Alerts.jsx**: Smart agricultural alerts and notifications
- **MetricCard.jsx**: Real-time metric display cards
- **SensorChart.jsx**: Live sensor data visualization
- **LandPlotMaps.jsx**: Interactive Google Maps integration
- **FarmingSuggestions.jsx**: AI-powered farming recommendations
- **ProductionOverview.jsx**: Crop production analytics

## 📌 **Agricultural System Roadmap**

### 🚧 **Current Development**
- [ ] 🌾 Enhanced crop disease detection algorithms
- [ ] 📱 Mobile app for field workers (React Native integration)
- [ ] 🤖 AI-powered irrigation automation recommendations
- [ ] 📊 Advanced analytics dashboard for yield prediction

### 🔮 **Future Agricultural Features**
- [ ] 🛰️ Satellite imagery integration for land analysis
- [ ] 🌡️ Microclimate monitoring with multiple sensor networks  
- [ ] 💧 Smart irrigation system automation
- [ ] 📈 Market price integration for profit optimization
- [ ] 🔍 Computer vision for crop health assessment
- [ ] 📊 Blockchain integration for supply chain traceability

### 🛠️ **Technical Improvements**
- [ ] Real-time data compression for large sensor networks
- [ ] Edge computing support for offline operation
- [ ] Multi-farm management dashboard
- [ ] Advanced data export capabilities (CSV, PDF reports)
- [ ] Integration with agricultural equipment APIs

## 🤝 **Contributing to Agricultural Innovation**

Join us in revolutionizing agriculture through technology! We welcome contributions in:

- 🌱 **Agricultural Features**: New crop types, specialized monitoring algorithms
- 🔬 **Sensor Integration**: Support for additional IoT devices and protocols  
- 📊 **Analytics**: Advanced data processing and visualization
- 🌦️ **Weather Services**: Enhanced forecasting and climate analysis
- 🗺️ **Mapping**: Improved geospatial features and land management
- 🐛 **Bug Fixes**: System stability and performance improvements
- 📖 **Documentation**: Agricultural use cases and implementation guides

## 📄 **License & Usage**

This IPCC Agricultural Monitoring System is open source and available for use in agricultural research and sustainable farming initiatives. When using this code:

- ✅ **Allowed**: Agricultural research, sustainable farming, educational purposes
- ✅ **Encouraged**: Contributions back to the community
- ⚠️ **Required**: Attribution to the IPCC project and original developers

---

## 🌱 **Ready to Transform Your Farm?**

This isn't just a monitoring system - it's the foundation for precision agriculture that can increase crop yields, reduce resource waste, and optimize farming operations through data-driven insights.

**Start your agricultural transformation today!**

```bash
git clone <your-repo>  
cd IPCC_Framework
npm install

# Configure for your farm
cp .env.example .env
# Edit .env with your agricultural setup

# Launch your monitoring system
npm run start:both
```

### 🌟 **Support Sustainable Agriculture - Star this project on GitHub!**

---

*Built with 💚 for farmers, agricultural researchers, and developers who believe technology can create a more sustainable and productive agricultural future.*

**Contributing to**: 
- 🌍 **Sustainable Agriculture**: Reducing resource waste through precision monitoring
- 📈 **Increased Yields**: Data-driven optimization for better crop production  
- 🔬 **Agricultural Research**: Open platform for testing new farming techniques
- 🌱 **Food Security**: Supporting efficient crop management for food sustainability
