var express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/users', async (req, res) => {
  const users = await database('users').select()
  res.status(200).json(users);
});

app.post('/api/v1/users', async (req, res) => {
  const { email, password } = req.body;
  if ( !email || !password ) return res.status(422).json('Please provide an email and password');
  const users = await database('users').select();
  const user = users.find(user => user.email === email);
  if (!user) return res.status(404).json('User not found');
  if (password !== user.password) return res.status(422).json('Password is incorrect');
  return res.status(200).json(user);
});

app.post('/api/v1/users/new', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(422).json('Please provide a name, email and password');
  const users = await database('users').select();
  const existingUser = users.find(user => user.email === email);
  if (existingUser) return res.status(422).json('User already exists');
  const newUser = await database('users').insert({ name, email, password }, 'id')
  return res.status(201).json({id: newUser[0]});
});

app.post('/api/v1/users/favorites/new', async (req, res) => {
  const { user_id, station_id } = req.body;
  if (!user_id || !station_id) return res.status(422).json('Please provide a user id and station id');
  const newFavorite = await database('favorites').insert({ user_id, station_id }, 'id');
  return res.status(201).json({id: newFavorite[0]});
});

app.get('/api/v1/users/:id/favorites', async (req, res) => {
  const favorites = await database('favorites').select();
  const userFavorites = favorites.filter(favorite => favorite.user_id == req.params.id);
  return res.status(200).json(userFavorites);
});

app.delete('/api/v1/users/:id/favorites/:station_id', async (req, res) => {
  const { id, station_id } = req.params;
  const favorites = await database('favorites').select();
  const favorite = favorites.find(favorite => favorite.user_id === id && favorite.station_id === station_id);
  if (!favorite) return res.status(404).json('Favorite not found')
  await database('favorites').where({ id: favorite.id }).del();
  return res.sendStatus(204);
});

module.exports = app;