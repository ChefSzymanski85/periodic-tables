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
let nextId = 1;
const reservations = [];

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: reservations,
  });
}

async function create(req, res) {
  const newReservation = req.body.data;

  const now = new Date().toISOString();
  newReservation.reservation_id = nextId++;
  newReservation.created_at = now;
  newReservation.updated_at = now;

  reservations.push(newReservation);

  res.status(201).json({
    data: newReservation,
  });
}

module.exports = {
  list,
  create: [hasData, hasPeople, create],
};
