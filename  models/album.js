const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number
});

module.exports = mongoose.model('Album', albumSchema);
