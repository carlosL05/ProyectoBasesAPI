const {Router} = require('express');
const router = Router();

//Pool de conexiones.
const pool = require('../../index');

router.get('/ruta', async (req,res)=>{
    res.status(200).send("Conectado :D! ")
})

/**
 * EJMPLO: DE QUERY : Dar las respuestas de una pregunta.
 */
router.get('/respuestas/:id', async (req,res)=>{
    const {id} = req.params; // id de la pregunta. 

    const sqlGet = `SELECT * FROM RESPUESTAS WHERE id_pregunta = ${id}`;

    await pool.pool.getConnection( (err,conection)=>{
        res.setHeader('Access-Control-Allow-Origin','*') ;
        console.log('La conexion funciona 2');
        if(err){
            res.status(400).send('Error de conexion a la DB: ' + err.message); 
            
        } 
        conection.query(sqlGet,(err,result)=>{
            if(err)res.status(400).send('Error en la consulara GET '+err.message);   
            else{
                res.status(200).json(result);
            }
        });
        
       conection.release();
    }
    )

});

module.exports = router;