import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { db } from '../database/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Schedules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [partTime, setPartTime] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const partTimeOptions = ["Job A", "Job B", "Job C"];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUsername(userData.username || ""); 
          } else {
            console.log('No user data found for the given email.');
          }
        } catch (err) {
          console.error('Error fetching user data: ', err);
          setError('Error fetching user data');
        }
      } else {
        console.log('No user is logged in.');
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
        username: username,
        hourlyWage: Number(hourlyWage)
      });

      console.log('Document written with ID: ', docRef.id);
      setPartTime("");
      setStartTime("");
      setEndTime("");
      setHourlyWage("");
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Failed to register schedule');
    }
  };

  return (
    <div>
      <h2>Schedules for {date}</h2>
      <p>Logged in as: {username}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* エラーメッセージを表示 */}
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