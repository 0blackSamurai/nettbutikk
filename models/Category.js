// models/categoryModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['genser', 't-skjorte'], required: true },
  description: { type: String },
  image: { type: String }
});

module.exports = mongoose.model('genre', genreSchema);