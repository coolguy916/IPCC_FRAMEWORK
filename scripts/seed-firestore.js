// scripts/seed-firestore.js - Seed Firestore with sample data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyD8xIhB_DYAl9e1FeS7ILql2YfxSdnbqHU',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'pcc-5fa54.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'ipcc-5fa54',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'ipcc-5fa54.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '481875426357',
    appId: process.env.FIREBASE_APP_ID || '1:481875426357:web:0ac421ed7e70b95614057c'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate sample sensor data
function generateSensorData(siteId, count = 30) {
    const data = [];
    const baseTime = new Date();
    
    for (let i = 0; i < count; i++) {
        const progressFactor = (count - i) / count;
        const timestamp = new Date(baseTime.getTime() - i * 24 * 3600000);
        
        data.push({
            site_id: siteId,
            timestamp: timestamp.toISOString(),
            temperature: parseFloat((22 + Math.random() * 5).toFixed(1)),
            soil_moisture: parseFloat((65 + Math.random() * 10).toFixed(1)),
            ph_level: parseFloat((6.7 + Math.random() * 0.4).toFixed(1)),
            nitrogen: parseFloat((20 + Math.random() * 5 * progressFactor).toFixed(1)),
            phosphorus: parseFloat((15 + Math.random() * 5 * progressFactor).toFixed(1)),
            potassium: parseFloat((25 + Math.random() * 5 * progressFactor).toFixed(1)),
            soil_health: parseFloat((92 + (Math.random() * 8 * progressFactor)).toFixed(1)),
            organic_matter: parseFloat((3.8 + (Math.random() * 1 * progressFactor)).toFixed(1)),
            created_at: serverTimestamp()
        });
    }
    
    return data;
}

// Generate sample financial data
function generateFinancialData(siteId, count = 10) {
    const data = [];
    const baseTime = new Date();
    
    for (let i = 0; i < count; i++) {
        const timestamp = new Date(baseTime.getTime() - i * 7 * 24 * 3600000); // Weekly data
        
        data.push({
            site_id: siteId,
            timestamp: timestamp.toISOString(),
            regenerative_profit: 7240 + Math.random() * 1000,
            regenerative_cost: 4260 + Math.random() * 500,
            conventional_cost: 5330 + Math.random() * 600,
            revenue: 15500 + Math.random() * 2000,
            microalgae_applied_liters: 6000 + Math.random() * 1000,
            land_area_hectares: 3,
            projected_harvest_kg: 13500 + Math.random() * 1500,
            cost_benefit_ratio: 2.5 + Math.random() * 0.5,
            yield_per_hectare: 4500 + Math.random() * 500,
            created_at: serverTimestamp()
        });
    }
    
    return data;
}

// Generate sample tasks
function generateTasks(siteId) {
    return [
        {
            site_id: siteId,
            title: 'Apply Microalgae Fertilizer',
            description: 'Apply organic microalgae fertilizer to boost soil nutrition',
            type: 'regenerative',
            category: 'Fertilization',
            date: new Date().toISOString().split('T')[0],
            is_completed: false,
            priority: 'high',
            created_at: serverTimestamp()
        },
        {
            site_id: siteId,
            title: 'Soil pH Testing',
            description: 'Monthly soil pH level monitoring and adjustment',
            type: 'maintenance',
            category: 'Testing',
            date: new Date(Date.now() + 2 * 24 * 3600000).toISOString().split('T')[0],
            is_completed: false,
            priority: 'medium',
            created_at: serverTimestamp()
        },
        {
            site_id: siteId,
            title: 'Irrigation System Check',
            description: 'Inspect and maintain drip irrigation system',
            type: 'maintenance',
            category: 'Infrastructure',
            date: new Date(Date.now() + 5 * 24 * 3600000).toISOString().split('T')[0],
            is_completed: false,
            priority: 'low',
            created_at: serverTimestamp()
        }
    ];
}

// Generate sample sites
function generateSites() {
    return [
        {
            name: 'Key Lime Primary Orchard',
            crop_type: 'Key Lime',
            area_hectares: 3.0,
            location: JSON.stringify({ lat: 3.1390, lng: 101.6869 }),
            description: 'Main key lime production site with regenerative agriculture practices',
            image_url: '',
            ideal_conditions: JSON.stringify({
                temperature_range: '22-30°C',
                ph_range: '6.0-7.5',
                soil_moisture: '60-80%'
            }),
            active: true,
            created_at: serverTimestamp()
        },
        {
            name: 'Nipis Orchard Section A',
            crop_type: 'Limau Nipis',
            area_hectares: 2.5,
            location: JSON.stringify({ lat: 3.1395, lng: 101.6875 }),
            description: 'Nipis lime cultivation with sustainable farming methods',
            image_url: '',
            ideal_conditions: JSON.stringify({
                temperature_range: '24-32°C',
                ph_range: '6.2-7.0',
                soil_moisture: '65-85%'
            }),
            active: true,
            created_at: serverTimestamp()
        },
        {
            name: 'Katsuri Orchard Section B',
            crop_type: 'Limau Katsuri',
            area_hectares: 2.0,
            location: JSON.stringify({ lat: 3.1400, lng: 101.6880 }),
            description: 'Katsuri lime experimental plot for research purposes',
            image_url: '',
            ideal_conditions: JSON.stringify({
                temperature_range: '23-31°C',
                ph_range: '6.0-7.2',
                soil_moisture: '60-75%'
            }),
            active: true,
            created_at: serverTimestamp()
        }
    ];
}

// Generate team members
function generateTeamMembers() {
    return [
        {
            name: 'Dr. Ahmad Rahman',
            role: 'Project Supervisor',
            type: 'supervisor',
            student_id: '',
            email: 'ahmad.rahman@university.edu.my',
            linkedin: '',
            instagram: '',
            image_url: '',
            responsibilities: JSON.stringify(['Project oversight', 'Research guidance', 'Quality assurance']),
            active: true,
            created_at: serverTimestamp()
        },
        {
            name: 'Sarah Lim Wei Ming',
            role: 'Lead Researcher',
            type: 'student',
            student_id: 'ST2021001',
            email: 'sarah.lim@student.edu.my',
            linkedin: '',
            instagram: '',
            image_url: '',
            responsibilities: JSON.stringify(['Data analysis', 'Field research', 'Report writing']),
            active: true,
            created_at: serverTimestamp()
        },
        {
            name: 'Muhammad Faiz',
            role: 'Field Assistant',
            type: 'student',
            student_id: 'ST2021002',
            email: 'muhammad.faiz@student.edu.my',
            linkedin: '',
            instagram: '',
            image_url: '',
            responsibilities: JSON.stringify(['Sensor maintenance', 'Data collection', 'Site monitoring']),
            active: true,
            created_at: serverTimestamp()
        }
    ];
}

async function seedFirestore() {
    try {
        console.log('🌱 Starting Firestore seeding...');

        // Seed sites first
        console.log('📍 Seeding sites...');
        const sites = generateSites();
        for (const site of sites) {
            await addDoc(collection(db, 'sites'), site);
        }

        // Seed team members
        console.log('👥 Seeding team members...');
        const teamMembers = generateTeamMembers();
        for (const member of teamMembers) {
            await addDoc(collection(db, 'team_members'), member);
        }

        // Seed sensor data for each site
        const siteIds = ['site_a_3_acres', 'site_nipis_orchard', 'site_katsuri_orchard'];
        
        for (const siteId of siteIds) {
            console.log(`🌡️ Seeding sensor data for ${siteId}...`);
            const sensorData = generateSensorData(siteId, 30);
            for (const data of sensorData) {
                await addDoc(collection(db, 'sensors_data'), data);
            }

            console.log(`💰 Seeding financial data for ${siteId}...`);
            const financialData = generateFinancialData(siteId, 10);
            for (const data of financialData) {
                await addDoc(collection(db, 'financial_data'), data);
            }

            console.log(`📋 Seeding tasks for ${siteId}...`);
            const tasks = generateTasks(siteId);
            for (const task of tasks) {
                await addDoc(collection(db, 'tasks'), task);
            }
        }

        // Seed program goals
        console.log('🎯 Seeding program goals...');
        const programGoals = [
            {
                id: 'co2_reduction',
                goal_type: 'CO2 Reduction',
                current_value: 2.3,
                target_value: 5.0,
                unit: 'tons/year',
                description: 'Carbon footprint reduction through regenerative practices',
                created_at: serverTimestamp()
            },
            {
                id: 'yield_improvement',
                goal_type: 'Yield Improvement',
                current_value: 15.2,
                target_value: 20.0,
                unit: '%',
                description: 'Crop yield improvement over conventional methods',
                created_at: serverTimestamp()
            }
        ];
        
        for (const goal of programGoals) {
            await addDoc(collection(db, 'program_goals'), goal);
        }

        // Seed system metrics
        console.log('📊 Seeding system metrics...');
        await addDoc(collection(db, 'system_metrics'), {
            cache_performance: JSON.stringify({
                hit_rate: 85.2,
                miss_rate: 14.8,
                avg_response_time: 120
            }),
            performance_metrics: JSON.stringify({
                api_response_time: 95,
                database_query_time: 45,
                frontend_load_time: 1.2
            }),
            daily_visits: JSON.stringify({
                today: 156,
                yesterday: 142,
                this_week: 892
            }),
            created_at: serverTimestamp()
        });

        console.log('✅ Firestore seeding completed successfully!');
        console.log('🔥 Your Firestore database now has sample data for all collections');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding Firestore:', error);
        process.exit(1);
    }
}

// Run the seeding
seedFirestore();