let db;
let realtimeService;

function initializeController(databaseInstance, realtimeDataService = null) {
    db = databaseInstance;
    realtimeService = realtimeDataService;
}

// ================================================================================= 
// SENSOR DATA ENDPOINTS
// ================================================================================= 

async function insertSensorData(req, res) {
    const { 
        site_id, 
        temperature, 
        soil_moisture, 
        ph_level, 
        nitrogen, 
        phosphorus, 
        potassium, 
        soil_health, 
        organic_matter 
    } = req.body;

    try {
        db.validate(req.body, {
            site_id: 'required',
            temperature: 'required',
            soil_moisture: 'required'
        });

        const sensorData = {
            site_id,
            timestamp: new Date().toISOString(),
            temperature: parseFloat(temperature),
            soil_moisture: parseFloat(soil_moisture),
            ph_level: parseFloat(ph_level || 0),
            nitrogen: parseFloat(nitrogen || 0),
            phosphorus: parseFloat(phosphorus || 0),
            potassium: parseFloat(potassium || 0),
            soil_health: parseFloat(soil_health || 0),
            organic_matter: parseFloat(organic_matter || 0),
            created_at: new Date().toISOString()
        };

        const result = await db.postData('sensor_data', sensorData);
        
        // Broadcast real-time update
        if (realtimeService) {
            await realtimeService.onNewSensorData({
                id: result.insertId,
                ...sensorData
            });
        }
        
        res.json({ 
            success: true, 
            id: result.insertId, 
            message: "Sensor data received and saved." 
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

async function getSensorData(req, res) {
    try {
        const { site_id, limit = 100, offset = 0, date_from, date_to } = req.query;
        
        let filters = {};
        if (site_id) filters.site_id = site_id;
        if (date_from) filters.timestamp = { operator: '>=', value: date_from };
        if (date_to) {
            if (filters.timestamp) {
                filters.created_at = { operator: 'between', value: [date_from, date_to] };
            } else {
                filters.timestamp = { operator: '<=', value: date_to };
            }
        }

        const options = {
            orderBy: { column: 'timestamp', direction: 'DESC' },
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        const result = await db.getDataByFilters('sensor_data', filters, options);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// SITES MANAGEMENT ENDPOINTS
// ================================================================================= 

async function getSites(req, res) {
    try {
        const { active } = req.query;
        let filters = {};
        if (active !== undefined) filters.active = active === 'true';

        const result = await db.getDataByFilters('sites', filters);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function createSite(req, res) {
    const { name, crop_type, area_hectares, location, description, image_url, ideal_conditions } = req.body;
    
    try {
        db.validate(req.body, {
            name: 'required',
            crop_type: 'required',
            area_hectares: 'required'
        });

        const site_id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        
        const siteData = {
            name,
            crop_type,
            area_hectares: parseFloat(area_hectares),
            location: JSON.stringify(location || {}),
            description: description || '',
            image_url: image_url || '',
            ideal_conditions: JSON.stringify(ideal_conditions || {}),
            active: true,
            created_at: new Date().toISOString()
        };

        const result = await db.postData('sites', siteData);
        res.json({ success: true, id: result.insertId, site_id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function updateSite(req, res) {
    const { site_id } = req.params;
    const updateData = { ...req.body, updated_at: new Date().toISOString() };
    
    try {
        const result = await db.table('sites').where('id', site_id).update(updateData);
        res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// TASKS MANAGEMENT ENDPOINTS
// ================================================================================= 

async function getTasks(req, res) {
    try {
        const { site_id, type, is_completed, date_from, date_to } = req.query;
        
        let filters = {};
        if (site_id) filters.site_id = site_id;
        if (type) filters.type = type;
        if (is_completed !== undefined) filters.is_completed = is_completed === 'true';
        if (date_from && date_to) {
            filters.date = { operator: 'between', value: [date_from, date_to] };
        }

        const options = {
            orderBy: { column: 'date', direction: 'ASC' }
        };

        const result = await db.getDataByFilters('tasks', filters, options);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function createTask(req, res) {
    const { site_id, title, description, type, category, date } = req.body;
    
    try {
        db.validate(req.body, {
            site_id: 'required',
            title: 'required',
            type: 'required',
            date: 'required'
        });

        const taskData = {
            site_id,
            title,
            description: description || '',
            type, // conventional, regenerative, manual
            category: category || 'General',
            date,
            is_completed: false,
            created_at: new Date().toISOString()
        };

        const result = await db.postData('tasks', taskData);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function updateTask(req, res) {
    const { task_id } = req.params;
    const updateData = { ...req.body };
    
    if (req.body.is_completed === true) {
        updateData.completed_at = new Date().toISOString();
    }
    
    try {
        const result = await db.table('tasks').where('id', task_id).update(updateData);
        
        // Broadcast real-time task update
        if (realtimeService && result.affectedRows > 0) {
            await realtimeService.onTaskUpdate({
                id: task_id,
                ...updateData
            });
        }
        
        res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function deleteTask(req, res) {
    const { task_id } = req.params;
    
    try {
        const result = await db.table('tasks').where('id', task_id).delete();
        res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// FINANCIAL DATA ENDPOINTS
// ================================================================================= 

async function getFinancialData(req, res) {
    try {
        const { site_id, limit = 30 } = req.query;
        
        let filters = {};
        if (site_id) filters.site_id = site_id;

        const options = {
            orderBy: { column: 'timestamp', direction: 'DESC' },
            limit: parseInt(limit)
        };

        const result = await db.getDataByFilters('financial_data', filters, options);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function insertFinancialData(req, res) {
    const { 
        site_id, 
        regenerative_profit, 
        regenerative_cost, 
        conventional_cost, 
        revenue, 
        microalgae_applied_liters, 
        land_area_hectares, 
        projected_harvest_kg 
    } = req.body;
    
    try {
        db.validate(req.body, {
            site_id: 'required',
            regenerative_profit: 'required'
        });

        const financialData = {
            site_id,
            timestamp: new Date().toISOString(),
            regenerative_profit: parseFloat(regenerative_profit),
            regenerative_cost: parseFloat(regenerative_cost || 0),
            conventional_cost: parseFloat(conventional_cost || 0),
            revenue: parseFloat(revenue || 0),
            microalgae_applied_liters: parseFloat(microalgae_applied_liters || 0),
            land_area_hectares: parseFloat(land_area_hectares || 0),
            projected_harvest_kg: parseFloat(projected_harvest_kg || 0),
            cost_benefit_ratio: regenerative_profit / (regenerative_cost || 1),
            yield_per_hectare: projected_harvest_kg / (land_area_hectares || 1),
            created_at: new Date().toISOString()
        };

        const result = await db.postData('financial_data', financialData);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// TEAM MEMBERS ENDPOINTS
// ================================================================================= 

async function getTeamMembers(req, res) {
    try {
        const { active, type } = req.query;
        
        let filters = {};
        if (active !== undefined) filters.active = active === 'true';
        if (type) filters.type = type; // student or supervisor

        const result = await db.getDataByFilters('team_members', filters);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function createTeamMember(req, res) {
    const { name, role, type, student_id, email, linkedin, instagram, image_url, responsibilities } = req.body;
    
    try {
        db.validate(req.body, {
            name: 'required',
            role: 'required',
            type: 'required',
            email: 'required|email'
        });

        const memberData = {
            name,
            role,
            type, // student or supervisor
            student_id: student_id || '',
            email,
            linkedin: linkedin || '',
            instagram: instagram || '',
            image_url: image_url || '',
            responsibilities: JSON.stringify(responsibilities || []),
            active: true,
            created_at: new Date().toISOString()
        };

        const result = await db.postData('team_members', memberData);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// PROGRAM GOALS ENDPOINTS
// ================================================================================= 

async function getProgramGoals(req, res) {
    try {
        const result = await db.getDataByFilters('program_goals', {});
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function updateProgramGoal(req, res) {
    const { goal_type } = req.params;
    const { current_value, target_value, description } = req.body;
    
    try {
        const updateData = {
            current_value: parseFloat(current_value),
            target_value: parseFloat(target_value),
            description,
            updated_at: new Date().toISOString()
        };

        const result = await db.table('program_goals').where('id', goal_type).update(updateData);
        res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// SYSTEM METRICS ENDPOINTS
// ================================================================================= 

async function getSystemMetrics(req, res) {
    try {
        const { limit = 1 } = req.query;
        
        const options = {
            orderBy: { column: 'created_at', direction: 'DESC' },
            limit: parseInt(limit)
        };

        const result = await db.getDataByFilters('system_metrics', {}, options);
        res.json({ success: true, data: result.length > 0 ? result[0] : {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function insertSystemMetrics(req, res) {
    const { cache_performance, performance_metrics, daily_visits } = req.body;
    
    try {
        const metricsData = {
            cache_performance: JSON.stringify(cache_performance || {}),
            performance_metrics: JSON.stringify(performance_metrics || {}),
            daily_visits: JSON.stringify(daily_visits || {}),
            created_at: new Date().toISOString()
        };

        const result = await db.postData('system_metrics', metricsData);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// ================================================================================= 
// DOSM STATS ENDPOINTS
// ================================================================================= 

async function getDOSMStats(req, res) {
    try {
        const result = await db.getDataByFilters('dosm_stats', { id: 'latest' });
        res.json({ success: true, data: result.length > 0 ? result[0] : {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function updateDOSMStats(req, res) {
    const { gdp_growth, agri_employment, food_security_index, quarter } = req.body;
    
    try {
        const statsData = {
            gdp_growth: parseFloat(gdp_growth),
            agri_employment,
            food_security_index,
            quarter,
            last_updated: new Date().toISOString()
        };

        // Update or insert the latest record
        const existing = await db.getDataByFilters('dosm_stats', { id: 'latest' });
        
        let result;
        if (existing.length > 0) {
            result = await db.table('dosm_stats').where('id', 'latest').update(statsData);
        } else {
            result = await db.postData('dosm_stats', { id: 'latest', ...statsData });
        }
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = {
    initializeController,
    // Sensor data
    insertSensorData,
    getSensorData,
    // Sites
    getSites,
    createSite,
    updateSite,
    // Tasks
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    // Financial data
    getFinancialData,
    insertFinancialData,
    // Team members
    getTeamMembers,
    createTeamMember,
    // Program goals
    getProgramGoals,
    updateProgramGoal,
    // System metrics
    getSystemMetrics,
    insertSystemMetrics,
    // DOSM stats
    getDOSMStats,
    updateDOSMStats
};