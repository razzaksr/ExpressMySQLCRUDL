const express=require('express')
const bodyParser = require('body-parser');
const cors=require('cors')

const app=express()
const port=2000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// import Sequelize and DataTypes
const{Sequelize,DataTypes}=require('sequelize')

// Settingup Sequelize with Database
const sequelize=new Sequelize('myexpresscrud','root','Razak@123',{
    host:'localhost',
    dialect:'mysql'
})

// Model creation for ORM
const product=sequelize.define('product',{
    pro_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    pro_name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    pro_price:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
})

//sync MySQL with ORM Sequelize
sequelize.sync().then(()=>{
    console.log('Database and ORM synchronized')
})

// delete
app.delete('/:pro_id',async(req,res)=>{
    try{
        const datum=await product.findByPk(req.params.pro_id)
        if(datum){
            await datum.destroy()
            res.status(204).end()
        }
        else{
            res.status(404).json({message:"Product Not Found"})
        }
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

// update
app.put('/:pro_id',async(req,res)=>{
    try{
        const datum=await product.findByPk(req.params.pro_id)
        if(datum){
            await datum.update(req.body)
            res.status(200).json(datum)
        }
        else{
            res.status(404).json({message:"Product Not Found"})
        }
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

// read by id
app.get('/:id',async(req,res)=>{
    try{
        const datum=await product.findByPk(req.params.id)
        if(datum){
            res.status(200).json(datum)
        }
        else{
            res.status(404).json({message:"Product Not Found"})
        }
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

// create
app.post('/',async(req,res)=>{
    try{
        const pro = await product.create(req.body)
        res.status(200).json(pro)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

// list
app.get('/',async(req,res)=>{
    try{
        const datum=await product.findAll()
        res.status(200).json(datum)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})


app.listen(port,()=>{
    console.log("Node Express is running!!!!!!!!!!!!!!")
})