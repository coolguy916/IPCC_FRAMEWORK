// modules/database/databaseManager.js
const FirestoreDB = require('../../lib/db/firestoreDB');
const Database = require('../../lib/db/mysqlDB');
// Legacy Realtime Database (deprecated)
const FirebaseDB = require('../../lib/db/firebaseDB');

class DatabaseManager {
    constructor() {
        this.db = null;
        this.useFirebase = process.env.USE_FIREBASE === 'true';
        this.useFirestore = process.env.USE_FIRESTORE === 'true';
    }

    async initialize() {
        try {
            if (this.useFirebase || this.useFirestore) {
                // Use Firestore (new) instead of Realtime Database (old)
                this.db = new FirestoreDB({
                    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyD8xIhB_DYAl9e1FeS7ILql2YfxSdnbqHU',
                    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'pcc-5fa54.firebaseapp.com',
                    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://ipcc-5fa54-default-rtdb.firebaseio.com',
                    projectId: process.env.FIREBASE_PROJECT_ID || 'ipcc-5fa54',
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'ipcc-5fa54.appspot.com',
                    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '481875426357',
                    appId: process.env.FIREBASE_APP_ID || '1:481875426357:web:0ac421ed7e70b95614057c',
                    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-70NL19SKHL'
                });
            } else {
                this.db = new Database({
                    host: process.env.MYSQL_HOST || 'your-db-host',
                    user: process.env.MYSQL_USER || 'your-db-user',
                    password: process.env.MYSQL_PASSWORD || '',
                    database: process.env.MYSQL_DATABASE || ''
                });
                await this.db.connect();
            }

            console.log(`Database initialized: ${this.useFirebase || this.useFirestore ? 'Firestore' : 'MySQL'}`);
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    getDatabase() {
        return this.db;
    }

    async close() {
        if (this.db) {
            try {
                await this.db.close();
                console.log('Database connection closed');
            } catch (error) {
                console.error('Error closing database connection:', error);
                throw error;
            }
        }
    }

    isFirebase() {
        return this.useFirebase || this.useFirestore;
    }

    isFirestore() {
        return this.useFirestore;
    }
}

module.exports = DatabaseManager;