const express=require('express')
const mysql=require('mysql2')
const bodyParser = require('body-parser')
const session=require('express-session')
const bcrypt=require('bcrypt')

const app=express()
const port=4000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret:'zealous',
    resave:false,
    saveUninitialized:true
}))

const dataBase=mysql.createConnection({
    host:'localhost',
    user:'root',
    'password':"Razak@123",
    'database':'myexpresscrud'
})

dataBase.connect((err)=>{
    if(err){
        console.error("Unable to connect to database ",err)
        return;
    }
    console.log("Database connected")
})

// security modules
// signup
app.post('/signup',async(req,res)=>{
    const{username,password}=req.body
    const hashedPassword=await bcrypt.hash(password,10);
    try{
        dataBase.query("insert into users(username,password) values(?,?)",[username,hashedPassword],(err,result)=>{
            if(err){
                res.status(404).json({message:"SignUp Failed due to server"})
                return
            }
            if(result.affectedRows==0){
                res.status(404).json({message:"SignUp Failed due to invalid"})
                return
            }
            res.status(201).json({message:"Signup success"})
        })
    }catch(error){
        res.status(500).json({error:error.message})
        return
    }
})

//login
app.post('/login',async(req,res)=>{
    const{username,password}=req.body
    try{
        dataBase.query("select * from users where username=?",[username],async(erro,result)=>{
            if(result.length==0){
                return res.status(404).json({error:`${username} not available`})
            }
            const user=result[0];
            const isMatched=await bcrypt.compare(password,user.password);
            if(isMatched){
                req.session.userName=user.username
                return res.status(200).json({message:"Login success"})
            }
            return res.status(404).json({error:`${username} failed to login due to password mismatch`})
        })
    }
    catch(error){
        res.status(500).json({error:error.message})
        return
    }
})

// logout
app.get('/logout',async(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.error(err)
            return res.status(500).json({error:err.message})
        }
        return res.status(200).json({message:"Logout successful"})
    })
})

// check authentication for every api routes
const isAuthenticated=async(req,res,next)=>{
    if(!req.session.userName){
        return res.status(401).json({error:"Unauthorized"})
    }
    next()
}




//delete
app.delete('/:id',isAuthenticated,async(req,res)=>{
    const proId=req.params.id
    const sql="delete from product where pro_id=?"
    dataBase.query(sql,[proId],(err,result)=>{
        if(err){
            res.status(500).json({error:"Error while deleting the record"})
            return
        }
        if(result.affectedRows==0){
            res.status(404).json({message:"Product not found to delete"})
            return
        }
        res.json({message:`${proId} has removed from stock`})
    })
})

//update
app.put('/',isAuthenticated,async(req,res)=>{
    const{id,name,price}=req.body
    const sql="update product set pro_name=?, pro_price=? where pro_id=?"
    dataBase.query(sql,[name,price,id],(err,result)=>{
        if(err){
            res.status(500).json({error:"Error while updating the product"})
            return
        }
        if(result.affectedRows==0){
            res.status(404).json({message:"No product found"})
            return
        }
        res.json({message:`${id} has updated`})
    })
})

//read by id
app.get('/:id',isAuthenticated,async(req,res)=>{
    const proId=req.params.id;
    const sql="select * from product where pro_id=?"
    dataBase.query(sql,[proId],(err,row)=>{
        if(err){
            res.status(500).json({error:"Error retrieving data"})
            return
        }
        if(row.length==0){
            res.status(404).json({message:'Product Not Found'})
            return
        }
        res.json(row[0])
    })
})

// Create
app.post('/',isAuthenticated,async(req,res)=>{
    const{name,price}=req.body
    const sql="insert into product(pro_name,pro_price) values(?,?)"
    dataBase.query(sql,[name,price],(err,result)=>{
        if(err){
            res.status(500).json({error:"Error Creating new product"})
            return;
        }
        res.status(200).json({message:"Product added to stock",id:result.insertId})
    })
})

// list
app.get('/',isAuthenticated,async(req,res)=>{
    console.log("Default URL")
    const sql="select * from product"

    dataBase.query(sql,(err,rows)=>{
        if(err){
            console.error("error in retrieving data "+err);
            res.status(500).json({error:"error in retrieving data"})
            return;
        }
        if(rows.length==0){
            console.log("no data available")
            res.status(404).json({message:"no data available"})
            return;
        }
        res.json(rows)
    })

    // res.send("<h1>Default here</h1>")
})

app.get('/hi',async(req,res)=>{
    console.log("Hiiiiii URL")
    res.json({"hai":"Razak Mohamed","age":32})
})

app.listen(port,()=>{
    console.log("Node Express is running!!!!!!!!!!!!!!")
})