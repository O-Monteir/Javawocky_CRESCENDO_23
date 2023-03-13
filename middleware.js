// const Campground=require('./models/campground');
const ExpressError=require('./utils/ExpressError');
// const {campgroundSchema,reviewSchema}=require('./schemaValidate.js');
// const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log("REQ.USER....",req.user);
    //a passport functionality to get user data
    if(!req.isAuthenticated()){
        //we want to redirect user to the page they were viewing before logging in
        req.session.returnTo = req.originalUrl
        //where originalUrl is complete path of where we were
        req.flash('error','You must be signed in first');
        // return res.redirect('/login');
        return res.redirect('/');
    }
    next();

}