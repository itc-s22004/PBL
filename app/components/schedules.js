import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { db } from '../database/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebase';

const Schedules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [partTime, setPartTime] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const partTimeOptions = ["Job A", "Job B", "Job C"];
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'ユーザー');
      } else {
        setUserName('ログインしていません');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'schedules'), {
        day: date,
        partTime: partTime,
        startTime: Timestamp.fromDate(new Date(`${date}T${startTime}`)),
        endTime: Timestamp.fromDate(new Date(`${date}T${endTime}`)),
        username: userName,
        hourlyWage: Number(hourlyWage)
      });

      console.log('Document written with ID: ', docRef.id);
      setPartTime("");
      setStartTime("");
      setEndTime("");
      setHourlyWage("");
      setError(""); 
      setSuccessMessage("追加ができました。");
    } catch (e) {
      console.error('Error adding document');
      setError('Failed to register schedule');
      setSuccessMessage(""); 
    }
  };

  return (
    <div>
      <h2>Schedules for {date}</h2>
      <div className="user-info">
          <p>こんにちは、{userName}さん</p>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Part Time: </label>
          <select
            value={partTime}
            onChange={event => setPartTime(event.target.value)}
            required
          >
            <option value="" disabled>Select Part Time</option>
            {partTimeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Time: </label>
          <input 
            type="time" 
            value={startTime}
            onChange={event => setStartTime(event.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time: </label>
          <input 
            type="time" 
            value={endTime}
            onChange={event => setEndTime(event.target.value)}
            required
          />
        </div>
        <div>
          <label>Hourly Wage: </label>
          <input 
            type="number" 
            value={hourlyWage}
            onChange={event => setHourlyWage(event.target.value)}
            required
          />
        </div>
        <button type="submit">Register Schedule</button>
      </form>
    </div>
  );
};

export default Schedules;