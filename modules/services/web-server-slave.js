const express = require('express');
const fetch = require('node-fetch');

class WebServerSlave {
    constructor() {
        this.app = express();
        this.electronAPIUrl = process.env.ELECTRON_API_URL || 'http://localhost:5000';
        this.cache = new Map();
        this.cacheTimeout = 5000; // 5 seconds
    }

    _setupProxyRoutes() {
        // Proxy all requests to the main Electron server
        this.app.use('/api', async (req, res, next) => {
            try {
                const targetUrl = `${this.electronAPIUrl}${req.originalUrl}`;
                const response = await fetch(targetUrl, {
                    method: req.method,
                    headers: req.headers,
                    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
                });
                
                const data = await response.json();
                res.json(data);
            } catch (error) {
                console.error('Proxy error:', error);
                res.status(500).json({ success: false, error: 'Service unavailable' });
            }
        });
    }

    async start(port = 3001) {
        this._setupProxyRoutes();
        this.server = this.app.listen(port, () => {
            console.log(`🌐 Web Server (Slave) running on port ${port}`);
            console.log(`📡 Proxying to Electron server at ${this.electronAPIUrl}`);
        });
    }
}

module.exports = WebServerSlave;
