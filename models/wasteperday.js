const mongoose = require('mongoose');

const wastePerDaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const WastePerDay = mongoose.model('WastePerDay', wastePerDaySchema);

module.exports = WastePerDay;
