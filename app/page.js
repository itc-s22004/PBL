"use client";

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Calendar from "./components/Calendar.js";
import Login from "./components/login.js"
import Schedules from './components/schedules.js';
import Register from "./components/registerForm.js"

const Page = () => {
  return (
	  <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
	  </>
    //<Register />
  );
};

export default Page;
