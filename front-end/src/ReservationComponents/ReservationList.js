import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { reservationStatus } from "../utils/api";

function ReservationList({ reservations }) {
  const history = useHistory();

  async function onCancel(event) {
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      const id = Number(event.target.value);
      reservationStatus(id, { status: "cancelled" }).then(() => history.go(0));
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
      reservation_time,
    }) => (
      <tr key={reservation_id}>
        <th scope="row">
          {first_name} {last_name}
        </th>
        <td>{mobile_number}</td>
        <td>{people}</td>
        <td>
          <p data-reservation-id-status={reservation_id}>{status}</p>
        </td>
        <td>{reservation_time}</td>
        <td>
          {status === "booked" ? (
            <Link
              to={`/reservations/${reservation_id}/seat`}
              type="button"
              className="btn btn-success btn-sm"
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
            className="btn btn-warning btn-sm"
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger btn-sm"
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
      <table className="table table-responsive">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;
