
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('favorites', (favorite) => {
      favorite.integer('user_id').unsigned();
      favorite.foreign('user_id').references('users.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorites')
  ]);
};
