import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const location = useLocation();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    people: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
  });

  useEffect(() => {
    const loadReservation = async () => {
      const abortController = new AbortController();
      setError(null);
      try {
        const response = await readReservation(
          reservation_id,
          abortController.signal
        );
        // get date response in order to use for placeholder for edit reservation
        const thisDate = response.reservation_date.split("T")[0];
        setReservation({
          ...response,
          reservation_date: thisDate,
        });
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    };
    if (reservation_id) loadReservation();
  }, [reservation_id]);

  function createNewReservation(newReservation) {
    const { reservation_date } = newReservation;
    const abortController = new AbortController();
    createReservation(newReservation, abortController.signal)
      .then(() => {
        history.push(`/dashboard?date=${reservation_date}`);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  function editReservation(updatedReservation) {
    const { reservation_date } = updatedReservation;
    const abortController = new AbortController();
    updateReservation(
      updatedReservation,
      reservation_id,
      abortController.signal
    )
      .then(() => history.push(`/dashboard?date=${reservation_date}`))
      .catch(setError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.goBack();
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (location.pathname.includes("edit")) {
      editReservation({ ...reservation, people: parseInt(reservation.people) });
    } else {
      createNewReservation({
        ...reservation,
        people: parseInt(reservation.people),
      });
    }
  }

  return (
    <div>
      <h1 className="ml-5 mt-1 mb-3">
        {location.pathname.includes("edit") ? "Edit" : "New"} Reservation
      </h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="ml-5">
        <div className="row">
          <div className="col-lg-4">
            <label htmlFor="first_name" className="mt-1">
              First name:
            </label>
            <div className="mb-3">
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
          </div>
          <div className="col-lg-4">
            <label htmlFor="last_name" className="mt-1">
              Last name:
            </label>
            <div className="mb-3">
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
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <label htmlFor="people" className="mt-1">
              Number of people:
            </label>
            <div className="mb-3">
              <input
                name="people"
                type="number"
                className="form-control"
                id="people"
                min="1"
                value={reservation.people}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <label htmlFor="reservation_date" className="mt-1">
              Date of reservation:
            </label>
            <div className="mb-3">
              <input
                name="reservation_date"
                type="date"
                className="form-control"
                id="reservation_date"
                placeholder="2013-01-25"
                value={reservation.reservation_date}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <label htmlFor="mobile_number">Phone number:</label>
            <div className="mb-3">
              <input
                name="mobile_number"
                type="tel"
                className="form-control"
                id="mobile_number"
                placeholder="555-555-5555"
                value={reservation.mobile_number}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <label htmlFor="reservation_time" className="mt-1">
              Time of reservation:
            </label>
            <div className="mb-3">
              <input
                name="reservation_time"
                type="time"
                className="form-control"
                id="reservation_time"
                value={reservation.reservation_time}
                onChange={changeHandler}
                required={true}
              />
            </div>
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
          <button type="submit" className="btn btn-primary" value="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
