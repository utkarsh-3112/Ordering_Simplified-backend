const { Pool } = require("pg");

const db = new Pool({
    user: 'postgres',
    host: 'db.ywzgdlbyjbqwnfsaipiv.supabase.co',
    database: 'postgres',
    password: 'LhV8KuNVNtfdrYQ6',
    port: 5432,
})

module.exports = db;
