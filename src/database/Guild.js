const { Schema, model } = require('mongoose');
const Guild = new Schema({
  _id: {
    type: String,
  },
  prefix: {
    type: String,
    default: process.env.PREFIX,
  },
});
module.exports = model('Guild', Guild);