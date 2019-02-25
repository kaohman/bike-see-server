import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
app.use(express.json());
import shortid from 'shortid';

app.locals.users = [
  { id: '1', name: 'Karin', email: 'k@k', password: 'k' }
];
app.locals.cities = [];
app.locals.favorites = [];

app.get('/api/v1/users', (req, res) => {
  res.status(200).json(app.locals.users);
});

app.post('/api/v1/users', (req, res) => {
  const { email, password } = req.body;
  if ( !email || !password ) return res.status(422).json('Please provide an email and password');
  const user = app.locals.users.find(user => user.email === email);
  if (!user) return res.status(404).json('User not found');
  if (password !== user.password) return res.status(422).json('Password is incorrect');
  return res.status(200).json(user);
});

app.post('/api/v1/users/new', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(422).json('Please provide a name, email and password');
  const newUser = {
    id: shortid.generate(),
    name,
    email,
    password
  };
  app.locals.users.push(newUser);
  return res.status(201).json(newUser);
});

app.post('/api/v1/users/favorites/new', (req, res) => {
  const { user_id, station_id } = req.body;
  if (!user_id || !station_id) return res.status(422).json('Please provide a user id and station id');
  const newFavorite = {
    user_id,
    station_id
  };
  app.locals.favorites.push(newFavorite);
  return res.status(201).json(newFavorite);
});

app.get('/api/v1/users/:id/favorites', (req, res) => {
  const favorites = app.locals.favorites.filter(favorite => favorite.user_id == req.params.id);
  return res.status(200).json(favorites);
});

app.delete('/api/v1/users/:id/favorites/:station_id', (req, res) => {
  const { id, station_id } = req.params;
  const index = app.locals.favorites.findIndex(favorite => favorite.user_id === id && favorite.station_id === station_id);
  if (index === -1) return res.status(404).json('Favorite not found')
  app.locals.favorites.splice(index, 1)
  return res.sendStatus(204);
});

app.post('/api/v1/users/city/new', (req, res) => {
  // adds a new user city, this is called when new user is created and sets city to empty string
});

app.get('/api/v1/users/:id/city', (req, res) => {
  // gets the users current city, this is called in fetchUser when user logins in
});

app.put('/api/v1/users/:id/city', (req, res) => {
  // updates the users current city, this is called anytime the user changes their current city
});

export default app;