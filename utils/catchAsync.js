module.exports = func =>{
    //module. exports is where we are exporting whatever this function catches
    //func here is the function we are getting from other class
    
    return(req,res,next)=>{
        func(req,res,next).catch(next);
        //catch any error in the func passed and pass the control onto next
    }
}