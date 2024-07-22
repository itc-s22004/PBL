<<<<<<< HEAD
import React from 'react';
import Calendar from './pages/Calendar';
=======
"use client";
>>>>>>> b255d84701c8d7f2556d33b0bfeb199372f867e1

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Calendar from "./components/Calendar.js";
import Login from "./components/login.js"
import Register from "./components/registerForm.js"

const Page = () => {
  return (
<<<<<<< HEAD
    <div>
      <Calendar />
    </div>
  );
}
=======
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
    // <Register />
  );
};

export default Page;
>>>>>>> b255d84701c8d7f2556d33b0bfeb199372f867e1
