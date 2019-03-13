
exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() => knex('favorites').del())
    .then(() => {
      return Promise.all([
        knex('users').insert([
          {name: 'Karin', email: 'karin@example.com', password: 'password'}
        ], 'id')
        .then(user => {
          return knex('favorites').insert([
            { user_id: user[0], station_id: '61095b6d414001418d873aab20372c78' },
            { user_id: user[0], station_id: '9f6f6a4510efe5d4ea0c8fd550271c03' }
          ])
        })
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    })
    .catch (error => console.log(`Error seeding data: ${error}`));
};
