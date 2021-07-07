import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableCreate() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    createTable(table)
      .then(() => {
        //history.push(`/dashboard?date=${reservation.reservation_date}`);
        history.push("/dashboard");
      })
      .catch(setError);
  }

  function changeHandler({ target: { name, value } }) {
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }

  return (
    <div>
      <h1 className="ml-5 mt-1 mb-5">Insert New Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="ml-5">
        <div className="col-lg-3 col-md-6">
          <label htmlFor="table_name">Table Name:</label>
          <div className="mb-4">
            <input
              name="table_name"
              type="text"
              className="form-control"
              id="table_name"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
              // must be at least 2 characters
            />
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <label htmlFor="capacity">Capacity:</label>
          <div>
            <input
              name="capacity"
              type="number"
              className="form-control"
              id="capacity"
              min="1"
              value={table.capacity}
              onChange={changeHandler}
              required={true}
            />
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

export default TableCreate;
