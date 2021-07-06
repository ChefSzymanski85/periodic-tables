import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { reservationStatus } from "../utils/api";
// import { listReservations } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";
// import useQuery from "../utils/useQuery";
// import { previous } from "../utils/date-time";
// import { next } from "../utils/date-time";
// import { today } from "../utils/date-time";

function ReservationList({ reservations }) {
  const history = useHistory();

  async function onCancel(event) {
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      const id = Number(event.target.value);
      {
        reservationStatus(id, { status: "cancelled" }).then(() =>
          history.go(0)
        );
      }
    }
  }

  // fill in table with data from API
  const tableRows = reservations.map(
    ({
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      people,
      status,
      reservation_date,
      reservation_time,
    }) => (
      <tr key={reservation_id}>
        <th scope="row">{reservation_id}</th>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{people}</td>
        <td>
          <p data-reservation-id-status={reservation_id}>{status}</p>
        </td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>
          {status === "booked" ? (
            <Link
              to={`/reservations/${reservation_id}/seat`}
              type="button"
              className="btn btn-success"
              // onClick={() => {
              //   status = "seated";
              // }}
            >
              Seat
            </Link>
          ) : (
            ""
          )}
        </td>
        <td>
          <Link
            to={`/reservations/${reservation_id}/edit`}
            type="button"
            className="btn btn-warning"
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            data-reservation-id-cancel={reservation_id}
            value={reservation_id}
            onClick={onCancel}
          >
            Cancel
          </button>
        </td>
      </tr>
    )
  );

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Reservation ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone number</th>
            <th scope="col">Number of people</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;
