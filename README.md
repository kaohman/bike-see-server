# bikeSee (backend)
API endpoints for bikeSee app

### Set-Up Back-End
Clone back-end repo: ```git clone https://github.com/kaohman/bike-see-server.git```
Run ```npm install``` from root directory
Run ```npm start```

### Set-Up Front-End
Clone this repo: ```git clone https://github.com/kaohman/bike-see.git```
Run ```npm install``` from root directory
Run ```npm start``` and visit localhost:3000 in your browser

### Testing:
Jest and Supertest 
Run `npm test` from the root directory

### API Endpoints

- GET `api/v1/users` - get all users
- POST `ap1/v1/users` - login existing user
- POST `ap1/v1/users/new` - signup new user
- POST `ap1/v1/users/favorites/new` - add new favorite for user
- GET `ap1/v1/users/:id/favorites` - get all user's favorites
- DELETE `ap1/v1/users/:id/favorites/:station_id` - delete a user's favorite

### Contributors:  
- [Karin Ohman](https://github.com/kaohman)
