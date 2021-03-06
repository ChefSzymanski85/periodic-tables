const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// --------------- Middleware handlers-------------------

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function isValidReservation(req, res, next) {
  const requiredFields = [
    "first_name",
    "last_name",
    "people",
    "mobile_number",
    "reservation_date",
    "reservation_time",
  ];
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

function isSeated(req, res, next) {
  const { status } = req.body.data;
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: "Field 'status' cannot be 'seated' or 'finished'",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} not found.` });
}

function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if (typeof people === "number" && people >= 1) {
    return next();
  }
  next({
    status: 400,
    message: "Field 'people' must include at least one person",
  });
}

function isValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  // regex expression to format date
  if (!date.match(/\d{4}-\d{2}-\d{2}/)) {
    return next({
      status: 400,
      message: "Field 'reservation_date' must be of format YYYY-MM-DD",
    });
  }
  next();
}

function isValidTime(req, res, next) {
  const time = req.body.data.reservation_time;
  // regex expression to format time
  if (!time.match(/\d{2}:\d{2}/)) {
    return next({
      status: 400,
      message: "Field 'reservation_time' must be of format HH:MM",
    });
  }
  next();
}

// find current date and time to ensure reservation is made for a future date
function isFutureDate(req, rest, next) {
  // combine reservation date and time
  const dateAndTime = `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000Z`;
  // convert reservation to Date format
  const reservationDate = new Date(dateAndTime);
  // find current date in Date format
  const currentDate = new Date();
  // convert reservation date to ms
  const resDateInMs = reservationDate.getTime();
  // convert current date to ms in eastern time
  const currentDateInMs = currentDate.getTime() - 14400000;
  if (resDateInMs < currentDateInMs) {
    return next({
      status: 400,
      message: "Please make a reservation for a future date",
    });
  }
  next();
}

// ensure that reservations are only made during open hours
function openHours(req, res, next) {
  // combine date and time
  const dateAndTime = `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000Z`;
  const open = `${req.body.data.reservation_date}T10:30:00.000Z`;
  const closed = `${req.body.data.reservation_date}T21:30:00.000Z`;

  // convert to Date format
  const reservationDate = new Date(dateAndTime);
  const openFormatted = new Date(open);
  const closedFormatted = new Date(closed);

  // convert dates to ms
  const resDateInMs = reservationDate.getTime();
  const openInMs = openFormatted.getTime();
  const closedInMs = closedFormatted.getTime();

  if (resDateInMs < openInMs) {
    return next({
      status: 400,
      message: "Restaurant does not open until 10:30AM",
    });
  }
  if (resDateInMs > closedInMs) {
    return next({
      status: 400,
      message: "No reservations after 9:30PM",
    });
  }
  next();
}

function closedOnTuesdays(req, res, next) {
  const date = new Date(req.body.data.reservation_date);
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 1) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  next();
}

function isValidStatus(req, res, next) {
  const { status } = req.body.data;
  if (status === "unknown") {
    return next({
      status: 400,
      message: "Field 'status' cannot be 'unknown'.",
    });
  }
  next();
}

function isFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }
  next();
}

// ------------------ CRUD handlers ---------------------

async function list(req, res) {
  try {
    let response = [];
    if (req.query.mobile_number) {
      const mobile = req.query.mobile_number;
      response = await service.search(mobile);
    }
    if (req.query.date) {
      const { date } = req.query;
      response = await service.list(date);
    }
    return res.json({ data: response });
  } catch (error) {
    console.log(error);
  }
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

async function update(req, res) {
  const response = await service.update(req.body.data);
  res.json({ data: response });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservation_id } = res.locals.reservation;
  const response = await service.updateStatus(reservation_id, status);
  const newStatus = response[0].status;
  res.status(200).json({ data: { status: newStatus } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasData,
    hasPeople,
    isValidReservation,
    isSeated,
    isValidTime,
    isValidDate,
    openHours,
    closedOnTuesdays,
    isFutureDate,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasPeople,
    isValidReservation,
    isSeated,
    isValidTime,
    isValidDate,
    openHours,
    closedOnTuesdays,
    isFutureDate,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    isFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
