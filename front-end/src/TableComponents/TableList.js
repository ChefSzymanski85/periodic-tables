import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableList() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);
  //const [status, setStatus] = useState("Free");

  useEffect(loadTables);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      {table.occupied ? (
        <td data-table-id-status={table.table_id}>Occupied</td>
      ) : (
        <td data-table-id-status={table.table_id}>Free</td>
      )}
      <td>{table.reservation_id}</td>
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
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
      <ErrorAlert error={tablesError} />
    </div>
  );
}

export default TableList;
