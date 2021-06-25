const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// --------------- Middleware handlers-------------------
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function hasPeople(req, res, next) {
  const people = Number(req.body.data.people);
  if (people >= 1) {
    return next();
  }
  next({ status: 400, message: "party must include at least one person" });
}

// ------------------ CRUD handlers ---------------------

const reservations = [];

/**
 * List handler for reservation resources
 */

// added req.query argument
async function list(req, res) {
  const { date } = req.query;
  const reservationsByDate = await service.list(date);
  res.json({
    data: reservationsByDate,
  });
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, hasPeople, asyncErrorBoundary(create)],
};
