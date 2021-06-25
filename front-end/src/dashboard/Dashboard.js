import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous } from "../utils/date-time";
import { next } from "../utils/date-time";
import { today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();

  const query = useQuery().get("date");
  if (query) date = query;

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function previousHandler() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function nextHandler() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  function todayHandler() {
    history.push(`/dashboard?date=${today()}`);
  }

  // fill in table with data from API
  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.people}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
    </tr>
  ));

  // JSX
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone number</th>
            <th scope="col">Number of people</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
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
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
