import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationCreate() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    people: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
  });

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    createReservation(reservation)
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  //function isValidDate() {}

  return (
    <div>
      <h1 className="ml-5 mt-1 mb-3">Make A Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="ml-5">
        <div className="row">
          <label htmlFor="first_name" className="col-1">
            First name:
          </label>
          <div className="col-3 mb-3">
            <input
              name="first_name"
              type="text"
              className="form-control"
              id="first_name"
              value={reservation.first_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <label htmlFor="people" className="col-2">
            Number of people:
          </label>
          <div className="col-3 mb-3">
            <input
              name="people"
              type="text"
              className="form-control"
              id="people"
              min="1"
              value={reservation.people}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <label htmlFor="last_name" className="col-1">
            Last name:
          </label>
          <div className="col-3 mb-3">
            <input
              name="last_name"
              type="text"
              className="form-control"
              id="last_name"
              value={reservation.last_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <label htmlFor="reservation_date" className="col-2">
            Date of reservation:
          </label>
          <div className="col-3 mb-3">
            <input
              name="reservation_date"
              type="date"
              className="form-control"
              id="reservation_date"
              value={reservation.reservation_date}
              onChange={changeHandler}
              min="2021-06-23"
              max="2021-12-21"
              required={true}
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="mobile_number" className="col-1">
            Phone number:
          </label>
          <div className="col-3 mb-3">
            <input
              name="mobile_number"
              type="tel"
              className="form-control"
              id="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="555-555-5555"
              value={reservation.mobile_number}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <label htmlFor="reservation_time" className="col-2">
            Time of reservation:
          </label>
          <div className="col-3 mb-3">
            <input
              name="reservation_time"
              type="time"
              className="form-control"
              id="reservation_time"
              min="10:30"
              max="21:30"
              value={reservation.reservation_time}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div className="row mt-3 ml-1">
          <button
            type="cancel"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            //onSubmit={buttonSubmitHandler}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationCreate;
