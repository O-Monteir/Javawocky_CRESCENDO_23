const express=require('express')//import express
const app=express(); //execute express
//used to create an express app
const path=require('path')
// const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError')
const catchAsync=require('./utils/catchAsync');
const passport =require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const WastePerDay = require('./models/wasteperday');
const regression=require('regression');
const usersRoutes=require('./routes/users');

//MODELS
// const User = require('./models/user');
const Waste=require('./models/waste');

mongoose.set('strictQuery', true);


mongoose.connect('mongodb://127.0.0.1:27017/waste-db',{
    //pass in our options
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//recy-clever

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

//DATABASE CHECK
const collection = db.collection('wastes');
var id='640cb970be9146f28a922f2d';
Waste.findById(id, function(err,result){
    if(err){
        console.log(err);
    }
    else{
        console.log(result);
    }
});

//CONFIGURATION FOR APP
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
// app.use(express.static(__dirname+'/assets'));
app.use(express.urlencoded({extended:true}))
//to parse post method data
// app.use(methodOverride('_method'));
//where _method is our query string

app.use(express.static(path.join(__dirname,'public')))
app.use('/assets', express.static('assets'));

const sessionConfig={
    secret:'thishsouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now(),
        maxAge:Date.now()
    }
}



//TRY LATER 

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//session so we don't have to login on every request
//note passport.session should be below sessionConfig



passport.use(new LocalStrategy(User.authenticate()));
//our authenticate is located on User model. our model doesnt have it, but docs do

passport.serializeUser(User.serializeUser());
//how to store user in session
passport.deserializeUser(User.deserializeUser());
//how to unstore user data from session

app.use((req,res,next)=>{
    //print entire session to see whats going on
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
    //middleware should have next(). if not then we dont make it to route and error handlers, its broken
})

app.use('/',usersRoutes);

app.get('/',async(req,res)=>{
    const tips = await Waste.find();
    res.render('home', {tips}); //ejs
});

app.get('/waste-per-day', async (req, res) => {
    Waste.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            count: { $sum: 1 },
          },
        },
      ]).exec((err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal server error');
        }
        results.forEach(result => {
          const wastePerDay = new WastePerDay({
            date: new Date(result._id),
            count: result.count,
          });
          wastePerDay.save((err) => {
            if (err) {
              console.error(err);
            }
          });
        });
        res.render('waste-per-day', { results });
      });
  });

  app.get('/reg', async(req, res) => {
    const data = await WastePerDay.find();

  // Prepare data for regression analysis
  const dataPoints = data.map(({ date, count }) => {
    return [new Date(date).getTime(), count];
  });

  // Fit regression model to data
  const result = regression.linear(dataPoints);

  // Render EJS template with regression results
  res.render('regression', { result, dataPoints, data });
  

});
  
// app.get('/tips', async (req, res) => {
//   const tips = await Waste.find();
//   res.render( 'home', { tips });
// });

//ADD ROUTES
app.get('/add',async(req,res)=>{
    // const waste=await Waste.find({});
    // res.render('/',{waste})
   
    res.render('add')
})

app.post('/add',async(req,res)=>{
    // const waste=new Waste(req.body.Waste);
    // await waste.save();
    // res.redirect('home');
  const { title, tips } = req.body.waste;

  // Create a new Waste document and save it to the database
  const newWaste = new Waste({
    title,
    tips,
  });

  newWaste.save((err, waste) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving new Waste document');
    } else {
      console.log('New Waste document saved:', waste);
      res.redirect('/');
    }
  });
});

app.all('*',(req,res,next)=>{
    //where all is for all request
    //* is for every 'path'
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='SOME RANDOME ERRROR'
    res.status(statusCode).render('error',{err});
})

app.listen(8080, ()=>{
    console.log('CONNECTED TO PORT 3000')
})

