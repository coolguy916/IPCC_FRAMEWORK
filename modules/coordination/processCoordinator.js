const fs = require('fs');
const path = require('path');

class ProcessCoordinator {
    constructor() {
        this.lockFile = path.join(__dirname, '../../.service-locks');
        this.processId = process.pid;
        this.appMode = process.env.APP_MODE || 'electron';
    }

    async acquireServiceLock(serviceName) {
        try {
            let locks = {};
            if (fs.existsSync(this.lockFile)) {
                locks = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            }

            // Check if service is already locked by another process
            if (locks[serviceName] && this.isProcessRunning(locks[serviceName].pid)) {
                console.log(`⚠️  Service ${serviceName} is locked by PID ${locks[serviceName].pid}`);
                return false;
            }

            // Acquire lock
            locks[serviceName] = {
                pid: this.processId,
                mode: this.appMode,
                timestamp: Date.now()
            };

            fs.writeFileSync(this.lockFile, JSON.stringify(locks, null, 2));
            console.log(`🔒 Acquired lock for ${serviceName}`);
            return true;
        } catch (error) {
            console.error(`Error acquiring lock for ${serviceName}:`, error);
            return false;
        }
    }

    releaseServiceLock(serviceName) {
        try {
            if (!fs.existsSync(this.lockFile)) return;

            let locks = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            if (locks[serviceName] && locks[serviceName].pid === this.processId) {
                delete locks[serviceName];
                fs.writeFileSync(this.lockFile, JSON.stringify(locks, null, 2));
                console.log(`🔓 Released lock for ${serviceName}`);
            }
        } catch (error) {
            console.error(`Error releasing lock for ${serviceName}:`, error);
        }
    }

    releaseAllLocks() {
        try {
            if (!fs.existsSync(this.lockFile)) return;

            let locks = JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
            for (const [service, lock] of Object.entries(locks)) {
                if (lock.pid === this.processId) {
                    delete locks[service];
                }
            }
            fs.writeFileSync(this.lockFile, JSON.stringify(locks, null, 2));
            console.log('🔓 Released all locks');
        } catch (error) {
            console.error('Error releasing all locks:', error);
        }
    }

    isProcessRunning(pid) {
        try {
            process.kill(pid, 0);
            return true;
        } catch (error) {
            return false;
        }
    }

    getServiceStatus() {
        try {
            if (!fs.existsSync(this.lockFile)) return {};
            return JSON.parse(fs.readFileSync(this.lockFile, 'utf8'));
        } catch (error) {
            return {};
        }
    }
}

module.exports = ProcessCoordinator;
