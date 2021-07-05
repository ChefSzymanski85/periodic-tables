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
  next({ status: 404, message: `Table ${table_id} cannot be found.` });
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
  if (occupied === "occupied") {
    return next({
      status: 400,
      message: "Table is already occupied",
    });
  }
  next();
}

function isSeated(req, res, next) {
  // console.log(req.params);
  // console.log(req.body.data);
  // console.log(res.locals.reservation);
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: "Table is already seated",
    });
  }
  next();
}

function tableHasReservation(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `table is not occupied`,
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
  //const { reservation_id } = req.body.data; //Sean
  const { reservation_id, status } = res.locals.reservation;
  const table_id = res.locals.table_id;
  if (status === "booked") {
    await reservationService.updateStatus(reservation_id, "seated");
  }
  const response = await service.update(table_id, reservation_id);
  res.status(200).json({ data: response });
}

async function destroy(req, res) {
  //Sean
  // const { table_id } = req.params;
  // const { reservation_id } = res.locals.table;
  // res.json({ data: await service.destroy(table_id, reservation_id) });

  const { table_id, reservation_id } = res.locals.table;
  // console.log(table_id);
  // console.log(reservation_id);
  const response = await service.destroy(table_id);
  await reservationService.updateStatus(reservation_id, "finished");
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
    isSeated,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    //asyncErrorBoundary(tableIsUnoccupied),
    tableHasReservation,
    asyncErrorBoundary(destroy),
  ],
};
