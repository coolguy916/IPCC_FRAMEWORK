# Dynamic Environment Configuration Guide

## ✅ Problem SOLVED!

Your `.env` file **will no longer reset** when running `npm run serve:web` or any other commands. The new **Dynamic Environment Manager** preserves your settings while keeping backend integration automatic.

## 🚀 Quick Start

### 1. One-Time Setup
```bash
# Copy the example and customize (only needed once)
copy .envExample .env

# Or auto-setup for your preferred mode
npm run env:setup web    # For web development
npm run env:setup electron  # For desktop app
npm run env:setup both   # For hybrid development (recommended)
```

### 2. Run Your Application
```bash
# Web development (no more env resets!)
npm run serve:web

# Development with live reload
npm run dev:web

# Full hybrid development
npm run dev
```

### 3. Initialize Database (First Time)
```bash
npm run seed-database
```

## 🔧 Environment Management Commands

### Check Current Configuration
```bash
npm run env:status
```
Shows your current settings, port configuration, and system status.

### Validate Configuration
```bash
npm run env:validate
```
Checks for missing variables and configuration issues.

### Create Backup
```bash
npm run env:backup
```
Creates a backup before making changes.

### Restore from Backup
```bash
npm run env:restore
```
Restores previous configuration if something goes wrong.

## 🎯 How It Works

### Dynamic Environment Updates
- **Before**: Scripts copied static `.env.web` → overwrote your `.env` → lost customizations
- **After**: Scripts call `env-manager.js` → updates only necessary values → preserves your settings

### Backend Integration
Your environment automatically configures:
- ✅ **API URLs** that match your backend port
- ✅ **WebSocket URLs** for real-time features  
- ✅ **Firebase settings** for database
- ✅ **CORS origins** for web development
- ✅ **Serial ports** for IoT sensors

### Preserved User Settings
The system preserves your customizations for:
- Database credentials
- API ports (if you changed them)
- Security keys
- Debug settings
- Custom intervals

## 📋 Configuration Options

### Application Modes

#### `both` (Recommended)
- **Frontend**: React development server (port 3000)
- **Backend**: Express API + WebSocket (port 5001) 
- **Features**: Full real-time dashboard, serial communication
- **Use Case**: Complete development environment

#### `web`
- **Frontend**: React production build served by Express
- **Backend**: Express API + WebSocket (port 5001)
- **Features**: Real-time dashboard, no serial/electron
- **Use Case**: Web deployment, cloud hosting

#### `electron` 
- **Frontend**: Electron desktop application
- **Backend**: Express API + WebSocket (port 5001)
- **Features**: Desktop app, serial communication, system integration
- **Use Case**: Desktop application, local IoT monitoring

### Port Configuration

The system automatically ensures no port conflicts:

| Service | Default Port | Environment Variable |
|---------|--------------|---------------------|
| React Dev Server | 3000 | `PORT` |
| API Server | 5001 | `API_PORT` |
| WebSocket | 5001 | `WS_PORT` (same as API) |
| Firebase | Cloud | N/A |

### Real-time Update Intervals

Customize how often data updates:

```env
# Fast updates for live dashboard
SENSOR_DATA_INTERVAL=10000          # 10 seconds
SYSTEM_METRICS_INTERVAL=30000       # 30 seconds

# Moderate updates for efficiency  
TASK_UPDATE_INTERVAL=60000          # 1 minute
FINANCIAL_DATA_INTERVAL=300000      # 5 minutes
```

## 🔒 Security Configuration

### Development (Default)
```env
DB_ENCRYPTION_KEY=ipcc-secure-key-2024-agricultural-monitoring-system
JWT_SECRET=ipcc-jwt-secret-key-for-authentication-2024
CORS_ORIGIN=http://localhost:3000
```

### Production (Recommended)
```env
DB_ENCRYPTION_KEY=your-strong-random-key-here
JWT_SECRET=your-jwt-secret-production-key
CORS_ORIGIN=https://your-domain.com
```

## 🌍 Real-time Features Configuration

### WebSocket Connection
```env
# Frontend automatically connects to:
REACT_APP_WS_URL=ws://localhost:5001/ws

# Backend WebSocket features:
WS_HEARTBEAT_ENABLED=true      # Keep connections alive
WS_AUTO_RECONNECT=true         # Reconnect on disconnect  
WS_MAX_CONNECTIONS=100         # Max concurrent clients
```

### Firebase Real-time Database
```env
USE_FIREBASE=true              # Always enabled for real-time
FIREBASE_DATABASE_URL=https://ipcc-5fa54-default-rtdb.firebaseio.com
```

### Data Collection Intervals
```env
# How often to check for new sensor data
SENSOR_DATA_INTERVAL=10000     # 10 seconds = live updates

# How often to broadcast to connected clients  
WS_HEARTBEAT_INTERVAL=30000    # 30 seconds = connection health
```

## 🐛 Troubleshooting

### Environment Not Updating?
```bash
npm run env:status
```
Check current configuration and fix any validation errors.

### WebSocket Connection Failed?
```bash
npm run env:validate
```
Ensure `API_PORT` and `WS_PORT` are the same and available.

### Database Connection Issues?
```bash
npm run env:status
```
Verify Firebase configuration is complete.

### Port Conflicts?
```bash
npm run check-ports
```
The environment manager will automatically find available ports.

### Complete Reset?
```bash
npm run env:backup      # Save current settings
copy .envExample .env   # Reset to defaults
npm run env:setup both # Reconfigure
```

## 📈 Performance Benefits

### Environment Management
- **🚀 No More Resets**: Your settings persist across all npm commands
- **⚡ Auto-Configuration**: Backend URLs update automatically
- **🔧 Validation**: Prevents broken configurations
- **📦 Backup/Restore**: Safe to experiment

### Real-time System
- **📡 Live Updates**: WebSocket instead of polling
- **🔥 Firebase Integration**: Instant data synchronization  
- **⚙️ Auto-Reconnection**: Handles network interruptions
- **📊 Smart Broadcasting**: Only sends changed data

## 🎉 Ready to Go!

Your environment is now **bulletproof**:

1. ✅ **No more `.env` resets** when running commands
2. ✅ **Dynamic backend integration** with auto-configuration  
3. ✅ **Real-time WebSocket** for efficient data streaming
4. ✅ **Preserved customizations** across all development modes
5. ✅ **Production-ready** security and performance settings

Run `npm run serve:web` with confidence! 🚀