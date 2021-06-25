/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router(); // mergeParams?
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
