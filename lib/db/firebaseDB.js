// lib/firebase.js - Enhanced with better index handling
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set, get, update, remove, query, orderByChild, orderByKey, limitToFirst, limitToLast, equalTo, startAt, endAt } = require("firebase/database");
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash('sha256').update(process.env.DB_ENCRYPTION_KEY || '').digest();
const IV_LENGTH = 16;

class FirebaseQueryBuilder {
    constructor(database, tableName) {
        this.database = database;
        this.tableName = tableName;
        this.filters = {};
        this.orderField = null;
        this.orderDirection = 'asc';
        this.limitCount = null;
        this.selectFields = null;
        this.useClientSideFiltering = false;
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
    where(field, operator = '=', value = null) {
        if (typeof field === 'object' && field !== null) {
            // Handle object syntax: where({name: 'John', age: 25})
            Object.assign(this.filters, field);
        } else if (arguments.length === 2) {
            // Handle where(field, value) syntax
            this.filters[field] = { operator: '=', value: operator };
        } else {
            // Handle where(field, operator, value) syntax
            this.filters[field] = { operator, value };
        }
        return this;
    }

    whereIn(field, values) {
        if (Array.isArray(values) && values.length > 0) {
            this.filters[field] = { operator: 'in', value: values };
        }
        return this;
    }

    whereNotIn(field, values) {
        if (Array.isArray(values) && values.length > 0) {
            this.filters[field] = { operator: 'not-in', value: values };
        }
        return this;
    }

    whereBetween(field, min, max) {
        this.filters[field] = { operator: 'between', value: [min, max] };
        return this;
    }

    whereNull(field) {
        this.filters[field] = { operator: 'null' };
        return this;
    }

    whereNotNull(field) {
        this.filters[field] = { operator: 'not-null' };
        return this;
    }

    whereLike(field, pattern) {
        this.filters[field] = { operator: 'like', value: pattern };
        return this;
    }

    orWhere(field, operator = '=', value = null) {
        // Firebase doesn't support OR queries directly, but we can simulate some cases
        // For now, we'll store OR conditions separately and handle them in filtering
        if (!this.orConditions) this.orConditions = [];

        if (typeof field === 'object' && field !== null) {
            this.orConditions.push(field);
        } else if (arguments.length === 2) {
            this.orConditions.push({ [field]: { operator: '=', value: operator } });
        } else {
            this.orConditions.push({ [field]: { operator, value } });
        }
        return this;
    }

    // ORDER BY methods
    orderBy(field, direction = 'ASC') {
        this.orderField = field;
        this.orderDirection = direction.toLowerCase() === 'desc' ? 'desc' : 'asc';
        return this;
    }

    orderByDesc(field) {
        return this.orderBy(field, 'DESC');
    }

    orderByAsc(field) {
        return this.orderBy(field, 'ASC');
    }

    // LIMIT methods
    limit(count, offset = null) {
        this.limitCount = count;
        this.offsetCount = offset;
        return this;
    }

    take(count) {
        return this.limit(count);
    }

    skip(offset) {
        this.offsetCount = offset;
        return this;
    }

    // Execution methods
    async get() {
        try {
            const dataRef = ref(this.database.db, this.tableName);
            let firebaseQuery = dataRef;
            let useClientSideOrdering = false;
            let useClientSideFiltering = false;

            // Check if we need to use client-side filtering for complex queries
            const hasComplexFilters = this._hasComplexFilters();
            const hasMultipleFilters = Object.keys(this.filters).length > 1;
            
            if (hasComplexFilters || hasMultipleFilters || this.orConditions) {
                useClientSideFiltering = true;
            }

            // Simple single-field Firebase query optimization
            if (!useClientSideFiltering && Object.keys(this.filters).length === 1) {
                const [filterField, filterCondition] = Object.entries(this.filters)[0];
                
                // Only use Firebase query for simple equality filters
                if (filterCondition.operator === '=' || filterCondition.operator === '==') {
                    try {
                        firebaseQuery = query(dataRef, 
                            orderByChild(filterField), 
                            equalTo(filterCondition.value)
                        );
                        console.log(`Using Firebase query for ${this.tableName}.${filterField} = ${filterCondition.value}`);
                    } catch (error) {
                        console.warn(`Firebase query failed for ${this.tableName}.${filterField}, using client-side filtering:`, error.message);
                        useClientSideFiltering = true;
                        firebaseQuery = dataRef;
                    }
                }
            }

            // Try to apply Firebase ordering only if not using complex filtering
            if (!useClientSideFiltering && this.orderField) {
                try {
                    if (this.orderField === 'key' || this.orderField === '$key') {
                        firebaseQuery = query(firebaseQuery, orderByKey());
                    } else {
                        // Check if this is already part of a query
                        if (firebaseQuery === dataRef) {
                            firebaseQuery = query(firebaseQuery, orderByChild(this.orderField));
                        }
                    }

                    // Apply limit if ordering succeeded
                    if (this.limitCount && !this.offsetCount) {
                        if (this.orderDirection === 'desc') {
                            firebaseQuery = query(firebaseQuery, limitToLast(this.limitCount));
                        } else {
                            firebaseQuery = query(firebaseQuery, limitToFirst(this.limitCount));
                        }
                    }
                } catch (indexError) {
                    console.warn(`Index missing for ${this.tableName}.${this.orderField}. Using client-side sorting:`, indexError.message);
                    useClientSideOrdering = true;
                    // Don't reset query if we already have filtering applied
                    if (!useClientSideFiltering) {
                        firebaseQuery = dataRef;
                    }
                }
            } else if (this.orderField) {
                useClientSideOrdering = true;
            }

            // Execute the query
            console.log(`Executing query for ${this.tableName}:`, {
                useClientSideFiltering,
                useClientSideOrdering,
                filterCount: Object.keys(this.filters).length,
                orderField: this.orderField,
                limitCount: this.limitCount
            });

            const snapshot = await get(firebaseQuery);

            if (!snapshot.exists()) {
                return [];
            }

            let data = [];
            snapshot.forEach(childSnapshot => {
                const item = this.database._decryptRow(childSnapshot.val());
                data.push({ id: childSnapshot.key, ...item });
            });

            // Apply client-side filtering if needed
            if (useClientSideFiltering) {
                data = this._applyClientFilters(data);
            }

            // Apply client-side ordering if Firebase ordering failed
            if (useClientSideOrdering && this.orderField) {
                data = this._applySorting(data);
            }

            // Apply limit and offset after client-side processing
            if ((useClientSideOrdering || useClientSideFiltering) && (this.limitCount || this.offsetCount)) {
                let startIndex = this.offsetCount || 0;
                let endIndex = this.limitCount ? startIndex + this.limitCount : data.length;
                data = data.slice(startIndex, endIndex);
            }

            // Apply field selection
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

            console.log(`Query completed for ${this.tableName}: ${data.length} records returned`);
            return data;

        } catch (error) {
            console.error(`Firebase get error for ${this.tableName}:`, error);
            
            // Fallback: try with basic ref if query fails
            if (error.message.includes('Index not defined') || error.message.includes('permission_denied')) {
                console.warn(`Falling back to client-side processing for ${this.tableName}`);
                return this._fallbackGet();
            }
            
            throw error;
        }
    }

    // Fallback method for when Firebase queries fail
    async _fallbackGet() {
        try {
            const dataRef = ref(this.database.db, this.tableName);
            const snapshot = await get(dataRef);

            if (!snapshot.exists()) {
                return [];
            }

            let data = [];
            snapshot.forEach(childSnapshot => {
                const item = this.database._decryptRow(childSnapshot.val());
                data.push({ id: childSnapshot.key, ...item });
            });

            // Apply all filtering and sorting client-side
            data = this._applyClientFilters(data);
            
            if (this.orderField) {
                data = this._applySorting(data);
            }

            // Apply pagination
            if (this.offsetCount || this.limitCount) {
                let startIndex = this.offsetCount || 0;
                let endIndex = this.limitCount ? startIndex + this.limitCount : data.length;
                data = data.slice(startIndex, endIndex);
            }

            // Apply field selection
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

            return data;
        } catch (error) {
            console.error(`Fallback query failed for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Helper method to check for complex filters
    _hasComplexFilters() {
        return Object.values(this.filters).some(condition => {
            if (typeof condition !== 'object' || condition === null) return false;
            const { operator } = condition;
            return ['!=', '<>', '>', '>=', '<', '<=', 'in', 'not-in', 'between', 'like', 'null', 'not-null'].includes(operator);
        });
    }

    // Apply sorting client-side
    _applySorting(data) {
        return data.sort((a, b) => {
            let aVal = a[this.orderField];
            let bVal = b[this.orderField];

            // Handle null/undefined values
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';

            // Handle date strings and ISO timestamps
            if (typeof aVal === 'string' && (aVal.includes('T') || aVal.match(/^\d{4}-\d{2}-\d{2}/))) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            // Handle numeric strings
            if (!isNaN(aVal) && !isNaN(bVal) && aVal !== '' && bVal !== '') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            }

            if (aVal < bVal) return this.orderDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.orderDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    async first() {
        this.limit(1);
        const results = await this.get();
        return results.length > 0 ? results[0] : null;
    }

    async count(field = '*') {
        // For count, we don't need to decrypt or process data, just count
        try {
            const dataRef = ref(this.database.db, this.tableName);
            const snapshot = await get(dataRef);
            
            if (!snapshot.exists()) {
                return 0;
            }

            if (Object.keys(this.filters).length === 0 && !this.orConditions) {
                // Simple count without filters
                return snapshot.numChildren();
            }

            // Count with filters - need to process data
            const results = await this.get();
            return results.length;
        } catch (error) {
            console.error(`Count error for ${this.tableName}:`, error);
            return 0;
        }
    }

    async exists() {
        const count = await this.count();
        return count > 0;
    }

    async pluck(field) {
        this.select(field);
        const results = await this.get();
        return results.map(row => row[field]);
    }

    // UPDATE method
    async update(data) {
        if (Object.keys(data).length === 0) {
            throw new Error('No data provided for update');
        }

        try {
            // Get all matching records first using fallback to avoid index issues
            const records = await this._fallbackGet();

            if (records.length === 0) {
                return { affectedRows: 0 };
            }

            // Add updated timestamp
            const updateData = {
                ...data,
                updated_at: new Date().toISOString()
            };

            const updatePromises = records.map(record => {
                const recordRef = ref(this.database.db, `${this.tableName}/${record.id}`);
                const encryptedData = this.database._encryptData(updateData);
                return update(recordRef, encryptedData);
            });

            await Promise.all(updatePromises);
            console.log(`Updated ${records.length} records in ${this.tableName}`);
            return { affectedRows: records.length };
        } catch (error) {
            console.error(`Firebase update error for ${this.tableName}:`, error);
            throw error;
        }
    }

    // DELETE method
    async delete() {
        try {
            // Get all matching records first using fallback to avoid index issues
            const records = await this._fallbackGet();

            if (records.length === 0) {
                return { affectedRows: 0 };
            }

            const deletePromises = records.map(record => {
                const recordRef = ref(this.database.db, `${this.tableName}/${record.id}`);
                return remove(recordRef);
            });

            await Promise.all(deletePromises);
            console.log(`Deleted ${records.length} records from ${this.tableName}`);
            return { affectedRows: records.length };
        } catch (error) {
            console.error(`Firebase delete error for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Raw query method (limited functionality in Firebase)
    raw(path, params = []) {
        console.warn("Raw queries are not supported in Firebase. Use table() methods instead.");
        return Promise.resolve([]);
    }

    // Apply client-side filters
    _applyClientFilters(data) {
        return data.filter(item => {
            // Apply main filters
            for (const [field, condition] of Object.entries(this.filters)) {
                if (!this._matchesCondition(item, field, condition)) {
                    return false;
                }
            }

            // Apply OR conditions if any
            if (this.orConditions && this.orConditions.length > 0) {
                const orMatch = this.orConditions.some(orCondition => {
                    return Object.entries(orCondition).every(([field, condition]) => {
                        return this._matchesCondition(item, field, condition);
                    });
                });
                if (!orMatch) return false;
            }

            return true;
        });
    }

    _matchesCondition(item, field, condition) {
        const fieldValue = item[field];

        if (typeof condition !== 'object' || condition === null) {
            return fieldValue === condition;
        }

        const { operator, value } = condition;

        switch (operator) {
            case '=':
            case '==':
                return fieldValue == value;
            case '!=':
            case '<>':
                return fieldValue != value;
            case '>':
                return fieldValue > value;
            case '>=':
                return fieldValue >= value;
            case '<':
                return fieldValue < value;
            case '<=':
                return fieldValue <= value;
            case 'in':
                return Array.isArray(value) && value.includes(fieldValue);
            case 'not-in':
                return Array.isArray(value) && !value.includes(fieldValue);
            case 'between':
                return Array.isArray(value) && fieldValue >= value[0] && fieldValue <= value[1];
            case 'like':
                const pattern = value.replace(/%/g, '.*').replace(/_/g, '.');
                return new RegExp(pattern, 'i').test(String(fieldValue));
            case 'null':
                return fieldValue === null || fieldValue === undefined;
            case 'not-null':
                return fieldValue !== null && fieldValue !== undefined;
            default:
                return fieldValue === value;
        }
    }
}

class FirebaseDB {
    constructor(config) {
        this.firebaseApp = initializeApp(config);
        this.db = getDatabase(this.firebaseApp);
        this.config = config;
    }

    // Connection method (for compatibility)
    async connect() {
        console.log(`Connected to Firebase: ${this.config.projectId}`);
        return Promise.resolve();
    }

    // Chainable query builder
    table(tableName) {
        return new FirebaseQueryBuilder(this, tableName);
    }

    from(tableName) {
        return this.table(tableName);
    }

    // Raw query method (limited in Firebase)
    raw(path, params = []) {
        console.warn("Raw queries are not fully supported in Firebase. Use Firebase-specific methods instead.");
        return Promise.resolve([]);
    }

    // Validation method (same as MySQL version)
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

    // Encryption methods (same as MySQL version)
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
            // You can specify which fields to encrypt based on your needs
            // For now, let's assume sensitive fields contain 'password', 'email', 'phone', etc.
            const sensitiveFields = ['password', 'email', 'phone', 'address', 'name'];
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

    // Enhanced getDataByFilters with better error handling
    async getDataByFilters(tableName, filters = {}, options = {}) {
        try {
            let query = this.table(tableName);

            console.log(`getDataByFilters called for ${tableName}:`, { filters, options });

            // Apply filters
            if (Object.keys(filters).length > 0) {
                query = query.where(filters);
            }

            // Apply ordering with improved error handling
            if (options.orderBy) {
                try {
                    if (typeof options.orderBy === 'string') {
                        const parts = options.orderBy.trim().split(/\s+/);
                        const column = parts[0];
                        const direction = parts[1] || 'DESC';
                        query = query.orderBy(column, direction);
                    } else if (options.orderBy.column) {
                        const direction = options.orderBy.direction || 'DESC';
                        query = query.orderBy(options.orderBy.column, direction);
                    }
                } catch (indexError) {
                    console.warn(`Firebase index warning for ${tableName}:`, indexError.message);
                    console.warn(`Continuing with client-side sorting...`);
                }
            }

            // Apply limit
            if (options.limit && Number.isInteger(options.limit) && options.limit > 0) {
                query = query.limit(options.limit);
            }

            // Apply offset
            if (options.offset && Number.isInteger(options.offset) && options.offset > 0) {
                query = query.skip(options.offset);
            }

            const results = await query.get();
            console.log(`getDataByFilters completed for ${tableName}: ${results.length} records`);
            
            return results;

        } catch (error) {
            console.error(`Firebase getDataByFilters error for ${tableName}:`, error);
            
            // Return empty array instead of throwing to prevent dashboard crashes
            if (error.message.includes('Index not defined') || error.message.includes('permission')) {
                console.warn(`Returning empty array for ${tableName} due to index/permission issues`);
                return [];
            }
            
            throw error;
        }
    }

    // Legacy methods for backward compatibility with enhanced error handling
    async postData(tableName, data = {}) {
        try {
            const dataRef = ref(this.db, tableName);
            const newDataRef = push(dataRef);
            const encryptedData = this._encryptData(data);

            // Add timestamp
            encryptedData.created_at = new Date().toISOString();

            await set(newDataRef, encryptedData);
            console.log(`Data inserted into ${tableName}: ${newDataRef.key}`);
            return { insertId: newDataRef.key, affectedRows: 1 };
        } catch (error) {
            console.error(`Firebase postData error for ${tableName}:`, error);
            throw error;
        }
    }

    async updateData(tableName, data = {}, whereClause = '', whereParams = []) {
        try {
            // For Firebase, we need to parse the whereClause and whereParams
            // This is a simplified implementation
            const filters = this._parseWhereClause(whereClause, whereParams);

            return await this.table(tableName)
                .where(filters)
                .update(data);
        } catch (error) {
            console.error(`Firebase updateData error for ${tableName}:`, error);
            throw error;
        }
    }

    async deleteData(tableName, whereClause = '', whereParams = []) {
        try {
            const filters = this._parseWhereClause(whereClause, whereParams);

            return await this.table(tableName)
                .where(filters)
                .delete();
        } catch (error) {
            console.error(`Firebase deleteData error for ${tableName}:`, error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const results = await this.table('users').get();
            return results;
        } catch (error) {
            console.error("Firebase getAllUsers error:", error);
            return []; // Return empty array instead of throwing
        }
    }

    async insertUser(name, email) {
        try {
            const result = await this.postData('users', { name, email });
            return result;
        } catch (error) {
            console.error("Firebase insertUser error:", error);
            throw error;
        }
    }

    // Helper method to parse MySQL-style WHERE clauses for Firebase
    _parseWhereClause(whereClause, whereParams = []) {
        if (!whereClause) return {};

        const filters = {};
        let paramIndex = 0;

        // Simple parsing - you might need to enhance this based on your needs
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

    async close() {
        // Firebase connections are managed automatically
        console.log('Firebase connection closed.');
        return Promise.resolve();
    }

    check_up(data) {
        if (!data) {
            return { success: false, error: "Database not initialized for controller." };
        }
        return { success: true };
    }

    // Firebase-specific methods
    async query(path, params = []) {
        console.warn("Direct query method is not applicable to Firebase. Use table() methods instead.");
        return [];
    }
}

module.exports = FirebaseDB;