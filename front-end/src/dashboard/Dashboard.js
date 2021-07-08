import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous } from "../utils/date-time";
import { next } from "../utils/date-time";
import { today } from "../utils/date-time";
import ReservationList from "../ReservationComponents/ReservationList";
import TableList from "../TableComponents/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const history = useHistory();

  // use utility function to get date of the query
  const query = useQuery().get("date");
  if (query) date = query;

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  // button handlers to go back and forth between dates
  function previousHandler() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function nextHandler() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  function todayHandler() {
    history.push(`/dashboard?date=${today()}`);
  }

  return (
    <div>
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="ml-1 row">Reservations for {date}</h4>
        </div>
        <ErrorAlert error={error} />
        <ReservationList reservations={reservations} />
        <div className="row">
          <button
            type="button"
            className="btn btn-secondary ml-3"
            onClick={previousHandler}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-dark ml-2"
            onClick={todayHandler}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={nextHandler}
          >
            Next
          </button>
        </div>
        <TableList />
      </main>
    </div>
  );
}

export default Dashboard;
