const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/order');
const userRoutes=require('./api/routes/user');

const mongoDB = 'mongodb://localhost:27017/userInfo';
mongoose.connect(mongoDB,{useNewUrlParser:true},function(error) {
    if(error)
        {console.log(error);}
    console.log("connected");
  });
mongoose.Promise=global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    };
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;