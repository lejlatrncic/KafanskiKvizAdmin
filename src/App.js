import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import AdminPanel from "./AdminPanel";
import "./App.css";

function App() {
  return (
    <Router basename="/KafanskiKvizAdmin">
      <Routes>
        {/* Početna stranica, preusmeravanje na login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta za login */}
        <Route path="/login" element={<Login />} />

        {/* Zaštićena ruta */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


