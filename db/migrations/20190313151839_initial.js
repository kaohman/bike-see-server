
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (user) => {
      user.increments('id').primary();
      user.string('name');
      user.string('email');
      user.string('password');
      user.timestamps(true, true);
    }),

    knex.schema.createTable('favorites', (favorite) => {
      favorite.increments('id').primary();
      favorite.integer('user_id').unsigned();
      favorite.foreign('user_id').references('users.id');
      favorite.string('station_id');
      favorite.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('users')
  ]);
};
