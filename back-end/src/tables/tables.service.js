const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((tables) => tables[0]);
}

function update(table_id, id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: id, occupied: "occupied" })
    .returning("*");
}

function destroy(table_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null, occupied: "free" })
    .returning("*");
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};
