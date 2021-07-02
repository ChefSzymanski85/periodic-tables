import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous } from "../utils/date-time";
import { next } from "../utils/date-time";
import { today } from "../utils/date-time";
//import ReservationList from "../ReservationComponents/ReservationList";
import TableList from "../TableComponents/TableList";

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
  //console.log(reservations);

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

  const tableRows = reservations.map(
    ({
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      people,
      reservation_date,
      reservation_time,
    }) => (
      <tr key={reservation_id}>
        <th scope="row">{reservation_id}</th>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{people}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>
          <Link
            to={`/reservations/${reservation_id}/seat`}
            type="button"
            className="btn btn-success"
          >
            Seat
          </Link>
        </td>
      </tr>
    )
  );

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
      {/* <ReservationList /> */}
      <TableList />
    </main>
  );
}

export default Dashboard;
