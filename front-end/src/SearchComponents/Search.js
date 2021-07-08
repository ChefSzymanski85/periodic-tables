import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationList from "../ReservationComponents/ReservationList";

function Search() {
  const [error, setError] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);

  function searchByNumber(mobile_number) {
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setPhoneNumber((previousNumber) => ({
      ...previousNumber,
      [name]: value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    const { mobile_number } = phoneNumber;
    searchByNumber(mobile_number);
  }

  return (
    <div>
      <h1 className="ml-5 mt-1 mb-5">Find A Reservation.</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="ml-5 mb-5">
        <label htmlFor="mobile_number" className="ml-3 mt-1">
          Phone number:
        </label>
        <div className="col-sm-12 col-lg-5">
          <input
            className="form-control"
            name="mobile_number"
            type="tel"
            id="search"
            onChange={changeHandler}
            placeholder="Enter a customer's phone number"
          />
        </div>
        <button type="submit" className="btn btn-primary ml-3 mt-2">
          Find
        </button>
      </form>
      {reservations.length ? (
        <ReservationList reservations={reservations} />
      ) : (
        <h4 className="mt-5 ml-5">No reservations found.</h4>
      )}
    </div>
  );
}

export default Search;
