import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { db } from '../database/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../styles/Schedules.css'; // Import the CSS

const Schedules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');

  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [partTime, setPartTime] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const auth = getAuth(); // Add this line to initialize auth

  const partTimeOptions = ["Job A", "Job B", "Job C"];
  const wageMapping = {
    "Job A": 1000,
    "Job B": 1200,
    "Job C": 1500
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'ユーザー');
      } else {
        setUserName('ログインしていません');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handlePartTimeChange = (event) => {
    const selectedPartTime = event.target.value;
    setPartTime(selectedPartTime);
    setHourlyWage(wageMapping[selectedPartTime]);
  };

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
    <div className="container">
      <h2>日付: {formattedDate}</h2>
      <p>ユーザー名: {userName}</p>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>出勤場所: </label>
          <select
            value={partTime}
            onChange={handlePartTimeChange}
            required
          >
            <option value="" disabled>選択してください</option>
            {partTimeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label>開始時間: </label>
          <input 
            type="time" 
            value={startTime}
            onChange={event => setStartTime(event.target.value)}
            required
          />
        </div>
        <div>
          <label>終了時間: </label>
          <input 
            type="time" 
            value={endTime}
            onChange={event => setEndTime(event.target.value)}
            required
          />
        </div>
        <div>
          <label>時給: </label>
          <input 
            type="number" 
            value={hourlyWage}
            onChange={event => setHourlyWage(event.target.value)}
            required
            readOnly
          />
        </div>
        <button type="submit">予定を登録する</button>
      </form>
    </div>
  );
};

export default Schedules;
