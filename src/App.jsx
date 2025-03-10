import React from "react";
import { Routes, Route } from "react-router-dom";  // Import Routes and Route
import Home from "./components/Home";
import Form from "./components/Form";
import FormRenderer from "./components/FormRenderer";  // Import FormRenderer component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:id" element={<Form />} />
        <Route path="/form/:id/view" element={<FormRenderer />} />
      </Routes>
    </div>
  );
}

export default App;
