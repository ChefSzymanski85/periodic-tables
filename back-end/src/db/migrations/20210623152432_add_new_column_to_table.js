exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("mobile_number").notNullable();
    table.integer("people").unsigned().notNullable();
    table.date("reservation_date").notNullable();
    table.time("reservation_time").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.dropColumn("first_name").notNullable();
    table.dropColumn("last_name").notNullable();
    table.dropColumn("mobile_number").notNullable();
    table.dropColumn("people").unsigned().notNullable();
    table.dropColumn("reservation_date").notNullable();
    table.dropColumn("reservation_time").notNullable();
  });
};
