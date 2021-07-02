import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listTables } from "../utils/api";
import { finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableList() {
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function finishHandler({ target }) {
    const result = window.confirm("Is this table ready to seat new guests?");
    if (result) {
      const table_id = target.getAttribute("data-table-id-finish");
      const abortController = new AbortController();
      finishTable(table_id, abortController.signal).then(() => {
        history.push("/");
      });
    }
  }

  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>
        <p data-table-id-status={table.table_id}>
          {table.reservation_id ? "occupied" : "free"}
        </p>
      </td>
      {/* {table.reservation_id
        ? table.occupied === true
        : table.occupied === false}
      {table.occupied ? (
        <td data-table-id-status={table.table_id}>occupied</td>
      ) : (
        <td data-table-id-status={table.table_id}>free</td>
      )} */}
      <td>{table.reservation_id}</td>
      <td>
        {table.reservation_id && (
          <button
            type="button"
            className="btn btn-success"
            data-table-id-finish={table.table_id}
            // value={table.reservation_id}
            onClick={finishHandler}
          >
            Finish
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <div className="d-md-flex mb-3">
        <h5 className="mt-5 mb-0">Tables</h5>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Reservation ID</th>
            <th scope="col">Finish</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
      <ErrorAlert error={tablesError} />
    </div>
  );
}

export default TableList;
