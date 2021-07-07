import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatReservation } from "../utils/api";

function Seat() {
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [tablesError, setTablesError] = useState([]);

  const { reservation_id } = useParams();

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    history.push("/");
  }

  function changeHandler({ target: { value } }) {
    setTableId(() => value);
  }

  function submitHandler(event) {
    event.preventDefault();
    //event.stopPropagation();
    const abortController = new AbortController();
    seatReservation(reservation_id, tableId, abortController.signal)
      .then(() => history.push("/"))
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const options = tables.map((table) => (
    <option type="text" key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  return (
    <div>
      <h1 className="ml-5 mt-1 mb-5">Seat Reservation</h1>
      <ErrorAlert error={tablesError} />
      <form onSubmit={submitHandler} className="ml-5">
        <div className="col-lg-3 col-md-6">
          <label htmlFor="table_id">Table:</label>
          <div className="mb-4">
            <select
              name="table_id"
              type="text"
              className="form-select"
              id="table_id"
              onChange={changeHandler}
            >
              <option type="text" value="{Select Table...}">
                Select table...
              </option>
              {options}
            </select>
          </div>
        </div>
        <div className="row mt-5 ml-1">
          <button
            type="cancel"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Seat;
