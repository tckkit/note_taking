exports.up = function (knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments();
    table.integer("username_id").unsigned();
    table.foreign("username_id").references("users.id");
    table.string("note");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notes");
};
