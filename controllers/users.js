const User = require('../models/user');

module.exports.renderRegisterForm=(req,res)=>{
    // res.render('users/register');
    res.render('users/register');
}

module.exports.userRegistered=async(req,res)=>{
    try{
        const {email,username,password}=req.body;
        const user = new User({email, username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Camp Buddy!');
            res.redirect('/'); //CHANGE LINK TO HOME
        })
        //req.login is from passport, allows us to login a user who has jsut registered, doesn not support async
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
    
}



module.exports.showLoginForm=(req,res)=>{
    res.render('users/login');
}


module.exports.confirmLogin=(req,res)=>{
    req.flash('success','welcome back!');
    //to check what returnTo contains
    const redirectUrl=req.session.returnTo || '/';  //add a new ur;
    //redirect to prev path of user or just to campgrounds if returnTo is empty
    //delete the returnTo obj because we dont want it to just sit in the session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // if you're using express-flash
      
      req.flash('success',"Goodbye!");
      res.redirect('/'); //change later
    });
  }