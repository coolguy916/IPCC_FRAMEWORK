const { SerialPort } = require('serialport');

class ServiceManager {
    constructor() {
        this.services = new Map();
        this.mode = process.env.APP_MODE || 'electron';
        // Set default values for critical environment variables
        this.defaultAPIPort = 3000;
        this.defaultSerialPort = 'COM3'; // Adjust based on your system
    }

    async checkPortAvailability(port) {
        try {
            const testPort = new SerialPort({ path: port, baudRate: 9600 });
            testPort.close();
            return true;
        } catch (error) {
            console.log(`Serial port ${port} is already in use or unavailable`);
            return false;
        }
    }

    async checkAPIPortAvailability(port) {
        // Validate port parameter
        if (!port || port === '' || isNaN(port)) {
            console.error(`Invalid port value: "${port}". Using default port ${this.defaultAPIPort}`);
            port = this.defaultAPIPort;
        }
        
        // Ensure port is a number and within valid range
        const portNum = parseInt(port, 10);
        if (portNum < 0 || portNum > 65535) {
            console.error(`Port ${portNum} is out of valid range (0-65535). Using default port ${this.defaultAPIPort}`);
            port = this.defaultAPIPort;
        }

        const net = require('net');
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(portNum, () => {
                server.once('close', () => resolve(true));
                server.close();
            });
            server.on('error', (err) => {
                console.log(`Port ${portNum} check failed:`, err.message);
                resolve(false);
            });
        });
    }

    validateEnvironmentVariables() {
        // Validate and set API_PORT
        if (!process.env.API_PORT || process.env.API_PORT === '') {
            console.warn(`⚠️  API_PORT not set or empty. Using default port ${this.defaultAPIPort}`);
            process.env.API_PORT = this.defaultAPIPort.toString();
        }

        // Validate and set SERIAL_PORT if serial is enabled
        if (process.env.USE_SERIAL === 'true' && (!process.env.SERIAL_PORT || process.env.SERIAL_PORT === '')) {
            console.warn(`⚠️  SERIAL_PORT not set or empty. Using default ${this.defaultSerialPort}`);
            process.env.SERIAL_PORT = this.defaultSerialPort;
        }

        // Validate other critical environment variables
        if (!process.env.USE_SERIAL) {
            process.env.USE_SERIAL = 'false';
        }
        
        if (!process.env.USE_WS) {
            process.env.USE_WS = 'false';
        }
    }

    async initializeServices(managers) {
        console.log(`🔧 Initializing services in ${this.mode} mode`);

        // Validate environment variables first
        this.validateEnvironmentVariables();

        // Check what's already running
        const serialAvailable = process.env.USE_SERIAL === 'true' && 
            process.env.SERIAL_PORT && 
            await this.checkPortAvailability(process.env.SERIAL_PORT);

        const apiPortAvailable = await this.checkAPIPortAvailability(process.env.API_PORT);

        // Adjust configuration based on availability
        if (!serialAvailable && process.env.USE_SERIAL === 'true') {
            console.log('⚠️  Serial port unavailable - disabling serial services');
            process.env.USE_SERIAL = 'false';
        }

        if (!apiPortAvailable) {
            let newPort = parseInt(process.env.API_PORT) + 1;
            let attempts = 0;
            const maxAttempts = 10;

            // Try to find an available port
            while (attempts < maxAttempts) {
                const available = await this.checkAPIPortAvailability(newPort);
                if (available) {
                    console.log(`⚠️  Port ${process.env.API_PORT} unavailable - using ${newPort}`);
                    process.env.API_PORT = newPort.toString();
                    break;
                }
                newPort++;
                attempts++;
            }

            if (attempts >= maxAttempts) {
                throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
            }
        }

        return {
            serialEnabled: process.env.USE_SERIAL === 'true' && serialAvailable,
            wsEnabled: process.env.USE_WS === 'true',
            apiPort: parseInt(process.env.API_PORT, 10)
        };
    }
}

module.exports = ServiceManager;