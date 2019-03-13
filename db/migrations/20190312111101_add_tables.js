
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('users', (user) => {
      user.increments('id').primary();
      user.string('name');
      user.string('email');
      user.string('password');

      user.timestamps(true, true)
    }),

    knex.schema.table('favorites', (favorite) => {
      favorite.increments('id').primary();
      favorite.integer('user_id').unsigned();
      favorite.foreign('user_id').references('user.id');
      favorite.string('station_id');

      favorite.timestamps(true, true)
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('users')
  ]);
};