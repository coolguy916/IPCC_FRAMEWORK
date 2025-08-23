// lib/db/firestoreDB.js - Firestore Database Service
const { initializeApp } = require('firebase/app');
const { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter, 
    onSnapshot,
    serverTimestamp,
    writeBatch,
    runTransaction 
} = require('firebase/firestore');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash('sha256').update(process.env.DB_ENCRYPTION_KEY || '').digest();
const IV_LENGTH = 16;

class FirestoreQueryBuilder {
    constructor(database, collectionName) {
        this.database = database;
        this.collectionName = collectionName;
        this.constraints = [];
        this.selectFields = null;
    }

    // SELECT methods
    select(fields = '*') {
        if (Array.isArray(fields)) {
            this.selectFields = fields;
        } else if (typeof fields === 'string' && fields !== '*') {
            this.selectFields = fields.split(',').map(field => field.trim());
        }
        return this;
    }

    // WHERE methods
    where(field, operator = '==', value = null) {
        if (typeof field === 'object' && field !== null) {
            // Handle object syntax: where({name: 'John', age: 25})
            Object.entries(field).forEach(([key, val]) => {
                if (typeof val === 'object' && val.operator) {
                    this.constraints.push(where(key, this._mapOperator(val.operator), val.value));
                } else {
                    this.constraints.push(where(key, '==', val));
                }
            });
        } else if (arguments.length === 2) {
            // Handle where(field, value) syntax
            this.constraints.push(where(field, '==', operator));
        } else {
            // Handle where(field, operator, value) syntax
            this.constraints.push(where(field, this._mapOperator(operator), value));
        }
        return this;
    }

    whereIn(field, values) {
        if (Array.isArray(values) && values.length > 0) {
            this.constraints.push(where(field, 'in', values));
        }
        return this;
    }

    whereNotIn(field, values) {
        if (Array.isArray(values) && values.length > 0) {
            this.constraints.push(where(field, 'not-in', values));
        }
        return this;
    }

    whereBetween(field, min, max) {
        this.constraints.push(where(field, '>=', min));
        this.constraints.push(where(field, '<=', max));
        return this;
    }

    whereNull(field) {
        this.constraints.push(where(field, '==', null));
        return this;
    }

    whereNotNull(field) {
        this.constraints.push(where(field, '!=', null));
        return this;
    }

    // ORDER BY methods
    orderBy(field, direction = 'ASC') {
        const dir = direction.toLowerCase() === 'desc' ? 'desc' : 'asc';
        this.constraints.push(orderBy(field, dir));
        return this;
    }

    orderByDesc(field) {
        return this.orderBy(field, 'DESC');
    }

    orderByAsc(field) {
        return this.orderBy(field, 'ASC');
    }

    // LIMIT methods
    limit(count) {
        this.constraints.push(limit(count));
        return this;
    }

    take(count) {
        return this.limit(count);
    }

    // Helper method to map operators
    _mapOperator(operator) {
        const operatorMap = {
            '=': '==',
            '!=': '!=',
            '<>': '!=',
            '>': '>',
            '>=': '>=',
            '<': '<',
            '<=': '<=',
            'in': 'in',
            'not-in': 'not-in',
            'array-contains': 'array-contains',
            'array-contains-any': 'array-contains-any'
        };
        return operatorMap[operator] || '==';
    }

    // Execution methods
    async get() {
        try {
            const collectionRef = collection(this.database.db, this.collectionName);
            const q = this.constraints.length > 0 ? 
                query(collectionRef, ...this.constraints) : 
                collectionRef;

            const snapshot = await getDocs(q);
            
            let data = [];
            snapshot.forEach(doc => {
                const docData = this.database._decryptRow(doc.data());
                data.push({ id: doc.id, ...docData });
            });

            // Apply field selection if specified
            if (this.selectFields && Array.isArray(this.selectFields)) {
                data = data.map(item => {
                    const selected = { id: item.id };
                    this.selectFields.forEach(field => {
                        if (item.hasOwnProperty(field)) {
                            selected[field] = item[field];
                        }
                    });
                    return selected;
                });
            }

            console.log(`Firestore query completed for ${this.collectionName}: ${data.length} documents`);
            return data;

        } catch (error) {
            console.error(`Firestore get error for ${this.collectionName}:`, error);
            throw error;
        }
    }

    async first() {
        this.limit(1);
        const results = await this.get();
        return results.length > 0 ? results[0] : null;
    }

    async count() {
        try {
            // Note: Firestore doesn't have native count operations without reading docs
            // For large collections, consider using aggregation queries or maintain counters
            const results = await this.get();
            return results.length;
        } catch (error) {
            console.error(`Count error for ${this.collectionName}:`, error);
            return 0;
        }
    }

    async exists() {
        const count = await this.count();
        return count > 0;
    }

    // UPDATE method
    async update(data) {
        if (Object.keys(data).length === 0) {
            throw new Error('No data provided for update');
        }

        try {
            // First get all matching documents
            const records = await this.get();
            
            if (records.length === 0) {
                return { affectedRows: 0 };
            }

            // Add updated timestamp
            const updateData = {
                ...data,
                updated_at: serverTimestamp()
            };

            const batch = writeBatch(this.database.db);
            
            records.forEach(record => {
                const docRef = doc(this.database.db, this.collectionName, record.id);
                const encryptedData = this.database._encryptData(updateData);
                batch.update(docRef, encryptedData);
            });

            await batch.commit();
            console.log(`Updated ${records.length} documents in ${this.collectionName}`);
            return { affectedRows: records.length };

        } catch (error) {
            console.error(`Firestore update error for ${this.collectionName}:`, error);
            throw error;
        }
    }

    // DELETE method
    async delete() {
        try {
            // First get all matching documents
            const records = await this.get();
            
            if (records.length === 0) {
                return { affectedRows: 0 };
            }

            const batch = writeBatch(this.database.db);
            
            records.forEach(record => {
                const docRef = doc(this.database.db, this.collectionName, record.id);
                batch.delete(docRef);
            });

            await batch.commit();
            console.log(`Deleted ${records.length} documents from ${this.collectionName}`);
            return { affectedRows: records.length };

        } catch (error) {
            console.error(`Firestore delete error for ${this.collectionName}:`, error);
            throw error;
        }
    }

    // Real-time subscription
    onSnapshot(callback) {
        try {
            const collectionRef = collection(this.database.db, this.collectionName);
            const q = this.constraints.length > 0 ? 
                query(collectionRef, ...this.constraints) : 
                collectionRef;

            return onSnapshot(q, (snapshot) => {
                const data = [];
                snapshot.forEach(doc => {
                    const docData = this.database._decryptRow(doc.data());
                    data.push({ id: doc.id, ...docData });
                });
                callback(data);
            });

        } catch (error) {
            console.error(`Firestore onSnapshot error for ${this.collectionName}:`, error);
            throw error;
        }
    }
}

class FirestoreDB {
    constructor(config) {
        this.firebaseApp = initializeApp(config);
        this.db = getFirestore(this.firebaseApp);
        this.config = config;
    }

    // Connection method (for compatibility)
    async connect() {
        console.log(`Connected to Firestore: ${this.config.projectId}`);
        return Promise.resolve();
    }

    // Chainable query builder
    table(collectionName) {
        return new FirestoreQueryBuilder(this, collectionName);
    }

    collection(collectionName) {
        return this.table(collectionName);
    }

    from(collectionName) {
        return this.table(collectionName);
    }

    // Validation method
    validate(data, rules) {
        for (const [field, rule] of Object.entries(rules)) {
            if (rule.includes('required') && (data[field] === undefined || data[field] === null || data[field] === '')) {
                throw new Error(`${field} is required`);
            }
            if (rule.includes('email') && data[field] && !/^\S+@\S+\.\S+$/.test(data[field])) {
                throw new Error(`${field} must be a valid email`);
            }
        }
    }

    // Encryption methods
    encrypt(text) {
        if (text === null || typeof text === 'undefined') return text;
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        let encrypted = cipher.update(String(text), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    decrypt(encryptedText) {
        if (typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
            return encryptedText;
        }
        try {
            const textParts = encryptedText.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            const encryptedData = textParts.join(':');
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            return encryptedText;
        }
    }

    _encryptData(data) {
        const encryptedData = {};
        for (const [key, value] of Object.entries(data)) {
            // Specify which fields to encrypt
            const sensitiveFields = ['password', 'email', 'phone', 'address'];
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                encryptedData[key] = this.encrypt(value);
            } else {
                encryptedData[key] = value;
            }
        }
        return encryptedData;
    }

    _decryptRow(row) {
        if (!row || typeof row !== 'object') return row;

        const decryptedRow = { ...row };
        for (const key in decryptedRow) {
            if (typeof decryptedRow[key] === 'string' && decryptedRow[key].includes(':')) {
                const originalValue = decryptedRow[key];
                decryptedRow[key] = this.decrypt(originalValue);
                if (decryptedRow[key] !== originalValue && !isNaN(Number(decryptedRow[key]))) {
                    decryptedRow[key] = Number(decryptedRow[key]);
                }
            }
        }
        return decryptedRow;
    }

    // Enhanced getDataByFilters with Firestore optimizations
    async getDataByFilters(collectionName, filters = {}, options = {}) {
        try {
            let query = this.table(collectionName);

            console.log(`getDataByFilters called for ${collectionName}:`, { filters, options });

            // Apply filters
            if (Object.keys(filters).length > 0) {
                query = query.where(filters);
            }

            // Apply ordering
            if (options.orderBy) {
                if (typeof options.orderBy === 'string') {
                    const parts = options.orderBy.trim().split(/\s+/);
                    const column = parts[0];
                    const direction = parts[1] || 'DESC';
                    query = query.orderBy(column, direction);
                } else if (options.orderBy.column) {
                    const direction = options.orderBy.direction || 'DESC';
                    query = query.orderBy(options.orderBy.column, direction);
                }
            }

            // Apply limit
            if (options.limit && Number.isInteger(options.limit) && options.limit > 0) {
                query = query.limit(options.limit);
            }

            const results = await query.get();
            console.log(`getDataByFilters completed for ${collectionName}: ${results.length} documents`);
            
            return results;

        } catch (error) {
            console.error(`Firestore getDataByFilters error for ${collectionName}:`, error);
            return []; // Return empty array to prevent crashes
        }
    }

    // Legacy methods for backward compatibility
    async postData(collectionName, data = {}) {
        try {
            const collectionRef = collection(this.db, collectionName);
            const encryptedData = this._encryptData(data);

            // Add timestamp
            encryptedData.created_at = serverTimestamp();

            const docRef = await addDoc(collectionRef, encryptedData);
            console.log(`Document added to ${collectionName}: ${docRef.id}`);
            return { insertId: docRef.id, affectedRows: 1 };
        } catch (error) {
            console.error(`Firestore postData error for ${collectionName}:`, error);
            throw error;
        }
    }

    async updateData(collectionName, data = {}, whereClause = '', whereParams = []) {
        try {
            const filters = this._parseWhereClause(whereClause, whereParams);
            return await this.table(collectionName)
                .where(filters)
                .update(data);
        } catch (error) {
            console.error(`Firestore updateData error for ${collectionName}:`, error);
            throw error;
        }
    }

    async deleteData(collectionName, whereClause = '', whereParams = []) {
        try {
            const filters = this._parseWhereClause(whereClause, whereParams);
            return await this.table(collectionName)
                .where(filters)
                .delete();
        } catch (error) {
            console.error(`Firestore deleteData error for ${collectionName}:`, error);
            throw error;
        }
    }

    // Helper method to parse MySQL-style WHERE clauses
    _parseWhereClause(whereClause, whereParams = []) {
        if (!whereClause) return {};

        const filters = {};
        let paramIndex = 0;

        const conditions = whereClause.split(' AND ');

        conditions.forEach(condition => {
            const match = condition.match(/`?(\w+)`?\s*(=|!=|>|>=|<|<=|LIKE)\s*\?/i);
            if (match && paramIndex < whereParams.length) {
                const field = match[1];
                const operator = match[2].toLowerCase();
                const value = whereParams[paramIndex++];

                filters[field] = { operator, value };
            }
        });

        return filters;
    }

    // Real-time methods
    async subscribeToCollection(collectionName, callback, filters = {}) {
        try {
            let query = this.table(collectionName);
            
            if (Object.keys(filters).length > 0) {
                query = query.where(filters);
            }

            return query.onSnapshot(callback);
        } catch (error) {
            console.error(`Firestore subscription error for ${collectionName}:`, error);
            throw error;
        }
    }

    async close() {
        console.log('Firestore connection closed.');
        return Promise.resolve();
    }

    // Batch operations
    async batchWrite(operations) {
        try {
            const batch = writeBatch(this.db);
            
            operations.forEach(op => {
                const { type, collection: collectionName, id, data } = op;
                const docRef = doc(this.db, collectionName, id);
                
                switch (type) {
                    case 'set':
                        batch.set(docRef, this._encryptData(data));
                        break;
                    case 'update':
                        batch.update(docRef, this._encryptData(data));
                        break;
                    case 'delete':
                        batch.delete(docRef);
                        break;
                }
            });

            await batch.commit();
            console.log(`Batch operation completed: ${operations.length} operations`);
            return { success: true, operations: operations.length };
        } catch (error) {
            console.error('Batch write error:', error);
            throw error;
        }
    }

    // Transaction method
    async runTransaction(transactionCallback) {
        try {
            return await runTransaction(this.db, transactionCallback);
        } catch (error) {
            console.error('Transaction error:', error);
            throw error;
        }
    }
}

module.exports = FirestoreDB;