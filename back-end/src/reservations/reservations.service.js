const knex = require("../db/connection");

async function list(reservation_date) {
  //console.log(reservation_date);
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot("status", "finished")
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

// Tupac
function updateStatus(id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update({ status: status })
    .returning("*");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// Sean
// function updateStatus({ table_id, reservation_id }) {
//   return knex.transaction((trx) => {
//     return knex(reservations)
//       .transacting(trx)
//       .where({ reservation_id: reservation_id })
//       .update({ status: "seated" })
//       .then(() => {
//         return knex(tables)
//           .where({ table_id: table_id })
//           .update({ reservation_id: reservation_id })
//           .returning("*");
//       })
//       .then(trx.commit)
//       .catch(trx.rollback);
//   });
// }

// function destroy(table_id, reservation_id) {
//   return knex.transaction((trx) => {
//     return knex(reservations)
//       .transacting(trx)
//       .where({ reservation_id: reservation_id })
//       .update({ status: "finished" })
//       .then(() => {
//         return knex(tables)
//           .where({ table_id: table_id })
//           .update({ reservation_id: null })
//           .returning("*");
//       })
//       .then(trx.commit)
//       .catch(trx.rollback);
//   });
// }

module.exports = {
  list,
  read,
  create,
  updateStatus,
  //destroy,
  search,
};
