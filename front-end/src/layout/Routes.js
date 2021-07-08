import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationForm from "../ReservationComponents/ReservationForm";
import TableCreate from "../TableComponents/TableCreate";
import Seat from "../ReservationComponents/Seat";
import Search from "../SearchComponents/Search";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
