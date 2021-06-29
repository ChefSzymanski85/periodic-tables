const service = require("./tables.service");
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

// ------------------ CRUD handlers ---------------------

async function list(req, res) {
  // const { date } = req.query;
  // const reservationsByDate = await service.list(date);
  // res.json({
  //   data: reservationsByDate,
  // });
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);

  res.json(201).json({
    data: newTable,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, isValidReservation, asyncErrorBoundary(create)],
};
