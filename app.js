require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    let data = {layout: false}
    res.render('index', data);
  
  });

app.get('/artist-search', (req, res, next) => {
// Search artists whose name contains
var buscar = req.query['buscar']
 spotifyApi.searchArtists(buscar)
  .then(data => {
    /* console.log('Search artists by "lili "', data.body.artists.items); */
    res.render('artist-search', data.body.artists);
  }, function(err) {
    console.error(err);
   });
  
 });

 app.get('/albums/:id', (req, res, next) => {
    let id= req.params.id
    /* console.log('el ide es: ',id) */

    spotifyApi.getArtistAlbums(id)
       .then (function(data) {
           /* console.log('Artist albums', data.body); */
           res.render('albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
 });
 app.get('/musica/:id', (req, res, next) => {
    let id= req.params.id
   /*  console.log('El id de las pistas es.......: ',id); */

    spotifyApi.getAlbumTracks(id)
       .then (function(data) {
           /* console.log('Musica 🔊🔊🔊🔊🔊🔊🔊🔊🔊🔊', data.body); */
           res.render('musica', data.body);
       },
           function(err) {
            console.error(err);
        }
      );
 });



    // Run server
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
