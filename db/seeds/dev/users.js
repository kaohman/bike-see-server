
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => knex('favorites').del())
    .then(() => {
      // Inserts seed entries
      return Promise.all([
        knex('users').insert([
          {id: '1', name: 'Karin', email: 'karin@example.com', password: 'password'},
          {id: '2', name: 'Bobby', email: 'bobby@gmail.com', password: '123'}
        ]),
        knex('favorites').insert([
          { id: '1', user_id: '1', station_id: '61095b6d414001418d873aab20372c78' },
          { id: '2', user_id: '1', station_id: '9f6f6a4510efe5d4ea0c8fd550271c03' },
        ])
      ])
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
    });
};
