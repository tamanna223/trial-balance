import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrialBalance from "./TrialBalance";
import ChildTable from "./ChildTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/trialBalance"
          element={<TrialBalance />} // No need to pass data as a prop here
        />
        <Route
          path="/trialBalance/:parentGUID"
          element={<ChildTable />} // No need to pass data as a prop here
        />
      </Routes>
    </Router>
  );
}

export default App;
