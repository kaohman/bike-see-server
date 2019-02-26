import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid';

describe('api', () => {
  let users;
  let cities;
  let favorites;
  beforeEach(() => {
    users = [
      { id: '1', name: 'Karin', email: 'k@k', password: 'k' },
      { id: '2', name: 'Bobby', email: 'b@b', password: 'b' }
    ];
    cities = [
      { user_id: '1', city: 'Denver' }
    ];
    favorites = [
      { user_id: '1', station_id: '1' },
      { user_id: '1', station_id: '2' },
      { user_id: '2', station_id: '3' }
    ]
    app.locals.users = users;
    app.locals.cities = cities;
    app.locals.favorites = favorites;
  });

  describe('get /api/v1/users', () => {
    it('should return a 201 and an array of users', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
    });
  });

  describe('post /api/v1/users', () => {
    it('should return a 200 and the matched user if successful', async () => {
      const userLogin = {email:'k@k', password:'k'};
      const response = await request(app).post('/api/v1/users').send(userLogin);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(app.locals.users[0]);
    });

    it('should return a status of 422 and message if an email or password is not provided', async () => {
      const userLogin = { email: 'k@k' };
      const response = await request(app).post('/api/v1/users').send(userLogin);
      expect(response.status).toBe(422);
      expect(response.body).toBe('Please provide an email and password');
    });

    it('should return a status of 422 and message if the user password does not match', async () => {
      const userLogin = { email: 'k@k', password: 'wrong' };
      const response = await request(app).post('/api/v1/users').send(userLogin);
      expect(response.status).toBe(422);
      expect(response.body).toBe('Password is incorrect');
    });

    it('should return a status of 404 and message if the user does not exist', async () => {
      const userLogin = { email: 'c@c', password: 'beep' };
      const response = await request(app).post('/api/v1/users').send(userLogin);
      expect(response.status).toBe(404);
      expect(response.body).toBe('User not found');
    });
  });

  describe('post /api/v1/users/new', () => {
    it('should return a 201 and the new user if successful', async () => {
      const newUser = { name: 'new person', email: 'e@e', password: 'e' };
      const response = await request(app).post('/api/v1/users/new').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual('new person');
    });

    it('should return a status of 422 and message if a name an email or password is not provided', async () => {
      const newUser = { email: 'k@k' };
      const response = await request(app).post('/api/v1/users/new').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toBe('Please provide a name, email and password');
    });


    it('should return a status of 422 and message if a name an email or password is not provided', async () => {
      const newUser = { name: 'Kar', email: 'k@k', password: 'pass'};
      const response = await request(app).post('/api/v1/users/new').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toBe('User already exists');
    });
  });

  describe('post /api/v1/users/favorites/new', () => {
    it('should return a 201 and the new user if successful', async () => {
      const newFavorite = { user_id: '1', station_id: '2' };
      const response = await request(app).post('/api/v1/users/favorites/new').send(newFavorite);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newFavorite);
    });

    it('should return a status of 422 and message if a name an email or password is not provided', async () => {
      const newFavorite = { user_id: '1' };
      const response = await request(app).post('/api/v1/users/favorites/new').send(newFavorite);
      expect(response.status).toBe(422);
      expect(response.body).toBe('Please provide a user id and station id');
    });
  });

  describe('get /api/v1/users/:id/favorites', () => {
    it('should return a 200 and an array of favorites', async () => {
      const expected = [
        { user_id: '1', station_id: '1' },
        { user_id: '1', station_id: '2' }
      ];
      const response = await request(app).get('/api/v1/users/1/favorites');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expected);
    });
  });

  describe('delete /api/v1/users/:id/favorites/:station_id', () => {
    it('should return a 204 if successful', async () => {
      const response = await request(app).delete('/api/v1/users/1/favorites/2');
      expect(response.status).toBe(204);
    });

    it('should return a 404 and message if unsuccessful', async () => {
      const response = await request(app).delete('/api/v1/users/1/favorites/3');
      expect(response.status).toBe(404);
      expect(response.body).toBe('Favorite not found');
    });
  });

  describe('get /api/v1/users/:id/city', () => {
    it('should return a 200 and a city object', async () => {
      const response = await request(app).get('/api/v1/users/1/city');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user_id: '1', city: 'Denver' });
    });
  });

  describe('put /api/v1/users/:id/city', () => {
    it('should return a 200 and a city object', async () => {
      const newCity = { user_id: '1', city: 'boulder' };
      const response = await request(app).put('/api/v1/users/1/city').send(newCity);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newCity);
    });

    it('should return a 422 and message if missing info', async () => {
      const newCity = { user_id: '1' };
      const response = await request(app).put('/api/v1/users/1/city').send(newCity);
      expect(response.status).toBe(422);
      expect(response.body).toEqual('Please provide a city to update');
    });

    it('should return a 404 and message if it cannot find the user', async () => {
      const newCity = { user_id: '5', city: 'boulder' };
      const response = await request(app).put('/api/v1/users/5/city').send(newCity);
      expect(response.status).toBe(404);
      expect(response.body).toEqual('User city not found');
    });
  });
});