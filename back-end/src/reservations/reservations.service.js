const knex = require("../db/connection");

async function list(reservation_date) {
  //console.log(reservation_date);
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((reservations) => reservations[0]);
}

// not currently using this
function updateStatus(id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update({ status: status })
    .returning("*");
}

module.exports = {
  list,
  read,
  create,
  updateStatus,
};
