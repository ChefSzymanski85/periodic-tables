const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// --------------- Middleware handlers-------------------

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function isValidTable(req, res, next) {
  const requiredFields = ["table_name", "capacity"];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      next({
        status: 400,
        message: `Table must include a ${field}`,
      });
      return;
    }
  }
  next();
}

function isValidTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "Field 'table_name' must be at least 2 characters long",
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    res.locals.table_id = table_id;
    return next();
  }
  next({ status: 404, message: "Table not found." });
}

async function reservationExists(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id or other data is missing",
    });
  }
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} not found.` });
}

// if the table capacity is less than the number of people in the reservation, return 400 with an error message
function tableIsBigEnough(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity < people) {
    return next({
      status: 400,
      message: "Table capacity is too small to accommodate party of that size",
    });
  }
  next();
}

function tableIsUnoccupied(req, res, next) {
  const { occupied } = res.locals.table;
  if (occupied) {
    return next({
      status: 400,
      message: "Table is already occupied",
    });
  }
  next();
}

// ------------------ CRUD handlers ---------------------

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function update(req, res) {
  if (!req.body.data.reservation_id) {
    return { status: 400, message: "Reservation_id not found" };
  }
  const { reservation_id } = req.body.data;
  const table_id = res.locals.table_id;
  const response = await service.update(table_id, reservation_id);
  res.status(200).json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, isValidTable, isValidTableName, asyncErrorBoundary(create)],
  update: [
    tableExists,
    reservationExists,
    tableIsBigEnough,
    tableIsUnoccupied,
    asyncErrorBoundary(update),
  ],
};
