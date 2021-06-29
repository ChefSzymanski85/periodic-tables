const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// function to validate time
// function isTime(str) {
//   regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;

//   if (regexp.test(str)) {
//     return true;
//   } else {
//     return false;
//   }
// }

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

function hasPeople(req, res, next) {
  // converting 'people' to a number allows the form to be submitted correctly
  // not converting 'people' to number allows the back end tests to pass
  const people = Number(req.body.data.people);
  //console.log(people);
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
  //if (Number.isNaN(date)) {
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
  //if (isTime(time) === false) {
  if (!time.match(/\d{2}:\d{2}/)) {
    return next({
      status: 400,
      message: "Field 'reservation_time' must be of format HH:MM",
    });
  }
  next();
}

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
  //console.log(date);
  const dayOfWeek = date.getDay();
  //console.log(dayOfWeek);

  if (dayOfWeek === 1) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  next();
}

// ------------------ CRUD handlers ---------------------

//const reservations = [];

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
  create: [
    hasData,
    hasPeople,
    isValidReservation,
    isValidTime,
    isValidDate,
    openHours,
    closedOnTuesdays,
    isFutureDate,
    asyncErrorBoundary(create),
  ],
};
