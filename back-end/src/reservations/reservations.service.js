const knex = require("../db/connection");

async function list(reservation_date) {
  //console.log(reservation_date);
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((reservations) => reservations[0]);
}

module.exports = {
  list,
  create,
};
