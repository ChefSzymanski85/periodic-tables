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

function isValidReservation(req, res, next) {
  const requiredFields = ["table_name", "capacity"];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
      return;
    }
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    //res.locals.table = table;
    res.locals.table_id = table_id;
    return next();
  }
  next({ status: 404, message: "Table not found." });
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
  const { reservation_id } = req.body.data;
  const table_id = res.locals.table_id;
  const response = await service.update(table_id, reservation_id);
  res.status(200).json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, isValidReservation, asyncErrorBoundary(create)],
  update: [tableExists, asyncErrorBoundary(update)],
};
