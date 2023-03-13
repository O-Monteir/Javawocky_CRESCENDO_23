
const mongoose = require('mongoose');
const user=require('./user');
const Schema= mongoose.Schema;

const WasteSchema = new Schema({
  title: {
     type: String, required: true 
    },
  tips: { 
     type: [String], 
    },
  date: {
     type: Date,
     default: Date.now
    },
   author:{
       type:Schema.Types.ObjectId,
       ref:'User'
    },
});

module.exports = mongoose.model('Waste', WasteSchema);