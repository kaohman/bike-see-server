import app from './app';
// const MongoClient = require('mongodb').MongoClient;
// import password from './db-key';

// const uri = `mongodb+srv://kaohma:${password}@cluster0-drsae.mongodb.net/test?retryWrites=true`;
// const client = new MongoClient(uri, { useNewUrlParser: true });

app.set('port', 3001);

// client.connect(err => {
//   if (err) return console.log(err);

  app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')}.`)
  });

//   client.close();
// });

