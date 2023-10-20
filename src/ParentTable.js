import React from "react";
import { Link } from "react-router-dom";
import ChildTable from "./ChildTable";
import "./App.css";

const ParentTable = ({ data, topLevelParentTotals }) => {
  // Define CSS styles for the rows
  const rowStyles = {
    backgroundColor: "#133386",
    color: "white",
  };

  // Define styles for <th> and <td>
  const thStyles = {
    padding: "17px",
  };

  const tdStyles = {
    padding: "15px",
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <table className="table table-hover table-sm table-bordered  ">
        <thead>
          <tr style={rowStyles}>
            <th style={{ ...rowStyles, ...thStyles }} scope="col">
              LEDGER
            </th>
            <th style={{ ...rowStyles, ...thStyles }} scope="col">
              Credit
            </th>
            <th style={{ ...rowStyles, ...thStyles }} scope="col">
              Debit
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((parent, index) => (
            <tr key={index}>
              <td>
                <Link
                  to={{
                    pathname: `/trialBalance/${parent.GUID}`,
                    state: { data: parent },
                  }}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: "100%" }}>{parent.name}</div>
                </Link>
              </td>
              <td style={tdStyles}>
                {parseFloat(topLevelParentTotals[index].totalPositive).toFixed(
                  2
                )}
              </td>
              <td style={tdStyles}>
                {parseFloat(topLevelParentTotals[index].totalNegative).toFixed(
                  2
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pass the parent.GUID to ChildTable */}
    </div>
  );
};

export default ParentTable;
