import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
app.use(express.json());
import shortid from 'shortid';

app.locals.users = [];
app.locals.favorites = [];

app.get('/api/v1/users', (req, res) => {
  res.status(200).json(app.locals.users);
});

app.post('/api/v1/users', (req, res) => {
  const { email, password } = req.body;
  if ( !email || !password ) return res.status(422).json('Please provide an email and password');
  const user = app.locals.users.find(user => user.email === email);
  if (!user) return res.status(404).json('User not found');
  return res.status(201).json(user);
});

app.post('/api/v1/users/new', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json('Please provide an email and password');
  const newUser = {
    id: shortid.generate(),
    email,
    password
  };
  app.locals.users.push(newUser);
  return res.status(201).json(newUser);
});

app.post('/api/v1/users/favorites/new', (res, req) => {
  const { user_id, station_id } = req.body;
  if (!user_id || !favorite_id) return res.status(422).json('Please provide a user id and station id');
  const newFavorite = {
    user_id,
    station_id
  };
  app.locals.favorites.push(newFavorite);
  return res.status(201).json(newFavorite);
});

app.get('/api/v1/users/:id/favorites', (res, req) => {
  const favorites = app.locals.favorites.filter(favorite => favorite.user_id == req.params.id);
  if (!favorites) return res.status(404).json('No favorites found');
  return res.status(200).json(favorites);
});

app.delete('/api/v1/users/:id/favorites/:station_id', (res, req) => {
  const { id, station_id } = req.params;
  const favorite = app.locals.favorites.find(favorite => favorite.user_id === id && favorite.station_id === station_id);
  if (!favorite) return res.status(404).json('Favorite could not be deleted');
  return res.sendStatus(204);
});

export default app;