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
async function list(req, res) {
  const data = await service.list();
  res.json({
    data,
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
