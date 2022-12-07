const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const mysql = require("mysql2")

app.use(bodyParser.json())

function info(req){
    console.log(`Request URL: ${req.url}`)
    console.log(`Request Type: ${req.method}`)
}

const detectinfo = (req, res, next) => {
    let status = false
    if((req.method == "POST" || req.method == "PUT")){
        if(isNaN(req.body.product_price) || req.body.product_price < 0){
            status = true
            res.send("Product price  wajib integer dan lebih besar dari nol")
            info(req)
        }
    }
    else if(res.statusCode == 500){
        status = true
        res.send("Something Broke !")
        info(req)
    }
    if(!status){
        info(req)
        next()
    }
}

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'crud_db'
})

conn.connect((err) => {
    if(err) throw err;
    console.log('Mysql Connected...');
})

app.get('/api/products', detectinfo, (req, res, next) =>{
    let sql = "SELECT * FROM product"
    let query = conn.query(sql, (err, result) => {
        res.send(JSON.stringify({"status":200,"error":null,"response":result}))
    })
})

app.get('/api/products/:id', detectinfo, (req, res, next) => {
    let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status":200,"error":null,"response":results}))
    })
})

app.post('/api/products', detectinfo, (req, res, next) => {
    let data = {product_name: req.body.product_name, product_price : req.body.product_price}
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql,data,(err, results) => {
        if(err) throw err
        res.send(JSON.stringify({"status":200,"error":null,"response":"Insert data success"}))
    })
})


app.put('/api/products/:id', detectinfo, (req, res, next) => {
    let sql = "UPDATE product SET product_name='"+req.body.product_name+"',product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id
    let query = conn.query(sql, (err, results) => {
        if(err) throw err
        res.send(JSON.stringify({"status":200,"error":null,"response":"Update data success"}))
    })
})

app.delete('/api/products/:id', detectinfo, (req, res, next) => {
    let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
    let query = conn.query(sql,(err, results) => {
        res.send(JSON.stringify({"status":200,"error":null,"response":"Delete data success"}))
    })
})

app.listen(4500, ()=>{
    console.log("server run")
})