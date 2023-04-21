const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const Album = require('./ models/album');
dotenv.config();

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json()); // This line is necessary to parse JSON request bodies

// a. Show all albums
app.get('/api/albums', async (req, res) => {
  try {
    const albums = await Album.find({});
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).send('Error fetching albums');
  }
});


// Retrieve a specific album by ID
app.get('/api/albums/:id', async (req, res) => {
  const id = req.params.id;
  const album = await Album.findById(id);

  if (!album) {
    res.status(404).send('Album not found');
  } else {
    res.json(album);
  }
});


// c. Create a new album
app.post('/api/albums', async (req, res) => {
  const albumData = req.body;

  const existingAlbum = await Album.findOne({ title: albumData.title });

  if (existingAlbum) {
    res.status(409).send('Album already exists');
  } else {
    const newAlbum = new Album(albumData);
    const savedAlbum = await newAlbum.save();
    res.status(201).json(savedAlbum);
  }
});

// d. Update an album
app.put('/api/albums/:id', async (req, res) => {
  const id = req.params.id;
  const albumData = req.body;

  const album = await Album.findByIdAndUpdate(id, albumData, { new: true });

  if (!album) {
    res.status(404).send('Album not found');
  } else {
    res.json(album);
  }
});

// e. Delete an album
app.delete('/api/albums/:id', async (req, res) => {
  const id = req.params.id;

  const album = await Album.findByIdAndDelete(id);

  if (!album) {
    res.status(404).send('Album not found');
  } else {
    res.json(album);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Retrieve a specific album by title
app.get('api/albums/title/:title', async (req, res) => {
  const title = req.params.title;
  const albums = await Album.find({ title: title });

  if (albums.length === 0) {
    res.status(404).send('Album not found');
  } else {
    res.json(albums);
  }
});




app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
