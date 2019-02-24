import app from './app';

app.set('port', 3001);

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}.`)
});