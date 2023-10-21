import React, { useEffect, useState } from "react";

import ParentTable from "./ParentTable";
import "./App.css";

const Loader = () => (
  <div className="loader-container">
    <div className="loader" style={{ backgroundColor: "#133386" }}></div>
  </div>
);

const TrialBalance = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
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

  // Function to calculate total positive and total negative values for a parent
  function calculateTotalAmountsForTopLevelParents(data) {
    const totals = [];

    function sumAmounts(parent) {
      let totalPositive = 0;
      let totalNegative = 0;

      function recursiveSum(data) {
        if (data.data && Array.isArray(data.data)) {
          for (const dataItem of data.data) {
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

        if (data.children && Array.isArray(data.children)) {
          for (const child of data.children) {
            recursiveSum(child);
          }
        }
      }

      recursiveSum(parent);

      return { totalPositive, totalNegative };
    }

    data?.forEach((parent) => {
      const { totalPositive, totalNegative } = sumAmounts(parent);
      totals.push({ parentGUID: parent.GUID, totalPositive, totalNegative });
    });

    return totals;
  }

  const topLevelParentTotals = calculateTotalAmountsForTopLevelParents(data);
  console.log("data", data);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Trial Balance</h1>
      <ParentTable data={data} topLevelParentTotals={topLevelParentTotals} />
    </div>
  );
};

export default TrialBalance;
