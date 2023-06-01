require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { promisify }= require('util');
const fs = require('fs').promises;

//RUTAS
const ejemploRoute = require("./model/routes/ejemplo")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// MIDDLEWARE
app.use('/ejemplo', ejemploRoute );
app.get('/', (req,res)=>{
    res.send("Bienvenido a ProyectoBases!.");
})

app.listen(PORT, ()=>{
    console.log(`Sevidor corriendo en el puerto ${PORT}`);
})

/**
 * CONEXION CON LA DB
 */
const pool =mysql.createPool({
    host: process.env.Host_dev,
    user: process.env.Username_dev,
    password: process.env.Password_dev,
    database: process.env.data_base,
    connectionLimit: 10,
    ssl:{
        rejectUnauthorized: false
    }
});


pool.getConnection( (err,conection)=>{
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has to many connections');
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused');
        }
      }
    
      if (conection) conection.release();
      console.log('DB is Connected');
    
      return;
}
);

// Promisify Pool Querys
pool.query = promisify(pool.query);


module.exports.pool = pool;
module.exports.query = pool.query;

//Export fuera del modulo. Testing
exports.app = app;