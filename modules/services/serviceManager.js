const { SerialPort } = require('serialport');

class ServiceManager {
    constructor() {
        this.services = new Map();
        this.mode = process.env.APP_MODE || 'electron';
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
        const net = require('net');
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.once('close', () => resolve(true));
                server.close();
            });
            server.on('error', () => resolve(false));
        });
    }

    async initializeServices(managers) {
        console.log(`🔧 Initializing services in ${this.mode} mode`);

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
            const newPort = parseInt(process.env.API_PORT) + 1;
            console.log(`⚠️  Port ${process.env.API_PORT} unavailable - using ${newPort}`);
            process.env.API_PORT = newPort.toString();
        }

        return {
            serialEnabled: process.env.USE_SERIAL === 'true' && serialAvailable,
            wsEnabled: process.env.USE_WS === 'true',
            apiPort: process.env.API_PORT
        };
    }
}

module.exports = ServiceManager;
