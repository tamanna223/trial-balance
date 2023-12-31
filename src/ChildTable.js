import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "./App.css";
const ChildTable = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [noData, setNoData] = useState(false); // State to track if there's no data

  const { parentGUID } = useParams();
  console.log("parentGUID------>", parentGUID);

  const navigate = useNavigate();

  const handleRowClick = (rowGUID) => {
    navigate(`/trialBalance/${rowGUID}`);
  };

  // Function to handle the OK button click
  const handleOKClick = () => {
    navigate("/trialBalance");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // Set isLoading to true while fetching data
    setIsLoading(true);

    let tokenData =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydW5AY2V2aW91cy5jb20iLCJpYXQiOjE2OTc3OTQ1MDQsImV4cCI6MTY5OTIzNDUwNH0.rJrHNqE_nK9eE7VqLGUQbilpCnBy6xMRRnYMRCaY9iM";
    try {
      let bodyData = {
        DATABASE: "ABCDE",
      };
      let resp = await fetch("http://localhost:8000/getTrialBalance", {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          Authorization: `Bearer ${tokenData}`,
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log("Response Data:", data);
        setData(data);
      } else {
        console.error("Request failed with status:", resp.status);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      // Set isLoading to false after data is fetched
      setIsLoading(false);
    }
  };

  function findParentWithChildrenByGUID(data, parentGUID) {
    for (const parent of data) {
      if (parent.GUID === parentGUID) {
        // Include all children in the result
        return { ...parent, children: parent.children };
      }

      // Check if the parent has children before iterating
      if (parent.children && Array.isArray(parent.children)) {
        const foundParent = findParentWithChildrenByGUID(
          parent.children,
          parentGUID
        );
        if (foundParent) {
          return foundParent;
        }
      }
    }
    return null; // Return null if no match is found
  }

  const parent = findParentWithChildrenByGUID(data, parentGUID);
  const { totalPositive, totalNegative } = sumAmounts(parent);

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

  function sumAmounts(parent) {
    let totalPositive = 0;
    let totalNegative = 0;

    function recursiveSum(data) {
      if (data?.data && Array.isArray(data?.data)) {
        for (const dataItem of data?.data) {
          if (dataItem.AMOUNT) {
            const amount = parseFloat(dataItem.AMOUNT);
            if (!isNaN(amount)) {
              if (amount > 0) {
                totalPositive += amount;
              } else {
                totalNegative += amount;
              }
            }
          }
        }
      }

      if (data?.children && Array.isArray(data?.children)) {
        for (const child of data?.children) {
          recursiveSum(child);
        }
      }
    }

    recursiveSum(parent);

    return {
      totalPositive: totalPositive.toFixed(2), // Format to 2 decimal places
      totalNegative: totalNegative.toFixed(2), // Format to 2 decimal places
    };
  }
  // Render the loader if isLoading is true
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader" style={{ backgroundColor: "#133386" }}></div>
      </div>
    );
  } else if (parent.children && parent.children.length > 0) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <h2>Trial Balance</h2>
        <table className="table table-hover table-sm table-bordered">
          <table className="table table-hover table-sm table-bordered ">
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
              {parent.children?.map((row) => {
                const { totalPositive, totalNegative } = sumAmounts(row);
                return (
                  <tr
                    key={row.GUID}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleRowClick(row.GUID); // Programmatically navigate
                    }}
                  >
                    <td>{row.name}</td>
                    <td style={tdStyles}>{totalPositive}</td>
                    <td style={tdStyles}>{totalNegative}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          ;
        </table>
      </div>
    );
  } else if (noData) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Trial Balance</h2>
        <div className="message-box">
          <p>No data available for this parent.</p>
          <button onClick={handleOKClick} className="ok-button">
            OK
          </button>
        </div>
      </div>
    );
  } else {
    setNoData(true); // Set noData state to true when there's no data
    return null;
  }
};

export default ChildTable;
