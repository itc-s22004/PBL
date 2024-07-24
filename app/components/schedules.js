import { useLocation } from 'react-router-dom';
import React, { useState } from "react";

const Schedules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const colors = ["red", "blue", "yellow"];

  return (
    <div>
      <h2>Schedules for {date}</h2>
      <select>
        {colors.map((color) => (
          <option key={color}>{color}</option>
        ))}
      </select>
      <div>
        <label>Start Time: </label>
        <input 
          type="time" 
          value={startTime}
          onChange={event => setStartTime(event.target.value)}
        />
      </div>
      <div>
        <label>End Time: </label>
        <input 
          type="time" 
          value={endTime}
          onChange={event => setEndTime(event.target.value)}
        />
      </div>

      <div>
        <label>refresh Time: </label>
        <input 
          type="time" 
          value={refreshTime}
          onChange={event => setEndTime(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Schedules;
