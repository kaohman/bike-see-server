const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await database('users').select()
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error })
  }
});

app.post('/api/v1/users', async (req, res) => {
  const { email, password } = req.body;
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) return res.status(422).json(`Expected format: { email: <String>, password: <String> }. You are missing a ${requiredParameter}`)
  }

  try {
    const user = await database('users').select().where('email', email);
    if (user.length === 0) return res.status(404).json(`User email ${email} not found`);
    if (password !== user[0].password) return res.status(422).json(`User password is incorrect`)
    return res.status(200).json({ name: user[0].name, id: user[0].id })
  } catch (error) {
    return res.status(500).json({ error })
  }
});

app.get('/api/v1/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await database('users').select().where('id', parseInt(id));
    if (user.length == 0) return res.status(404).json(`User id ${id} not found`)
    return res.status(200).json({ name: user[0].name, id: user[0].id })
  } catch (error) {
    return res.status(500).json({ error })
  }
});

app.post('/api/v1/users/new', async (req, res) => {
  const { name, email, password } = req.body;
  for (let requiredParameter of ['name', 'email', 'password']) {
    if (!req.body[requiredParameter]) return res.status(422).json(`Expected format: { name: <String>, email: <String>, password: <String> }. You are missing a ${requiredParameter}`)
  }
  
  try {
    const dupUser = await database('users').select().where('email', email);
    if (dupUser.length > 0) return res.status(409).json(`Conflict. User with email ${email} already exists`)
    const newUserId = await database('users').insert({ name, email, password }, 'id')
    return res.status(201).json({ name, id: newUserId[0] })
  } catch (error) {
    return res.status(500).json({ error })
  }
});

app.post('/api/v1/users/favorites', async (req, res) => {
  const { user_id, station_id } = req.body;
  for (let requiredParameter of ['user_id', 'station_id']) {
    if (!req.body[requiredParameter]) return res.status(422).json(`Expected format: { user_id: <Integer>, station_id: <Integer> }. You are missing a ${requiredParameter}`);
  }

  try {
    const dupFavorite = await database('favorites').select().where({ user_id: parseInt(user_id), station_id: parseInt(station_id) });
    if (dupFavorite.length > 0) return res.status(409).json(`Conflict. User favorite station id ${station_id} already exists`)
    const newFavoriteId = await database('favorites').insert({ user_id, station_id }, 'id');
    return res.status(201).json({id: newFavoriteId[0]});
  } catch (error) {
    return res.status(500).json({ error })
  }

});

app.get('/api/v1/users/:id/favorites', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await database('users').select().where('id', parseInt(id));
    if (user.length === 0) return res.status(404).json(`User id ${id} not found`)
    const favorites = await database('favorites').select().where('user_id', parseInt(id));
    return res.status(200).json(favorites)
  } catch (error) {
    return res.status(500).json({ error })
  }
});

app.delete('/api/v1/users/:id/favorites/:station_id', async (req, res) => {
  const { id, station_id } = req.params;
  try {
    const matchingFavorite = await database('favorites').select().where({ user_id: parseInt(id), station_id: parseInt(station_id) });
    if (matchingFavorite.length === 0) return res.status(404).json(`Favorite user id ${id} and station id ${station_id} not found`)
    await database('favorites').where('id', matchingFavorite[0].id).del();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error })
  }
});

module.exports = app;