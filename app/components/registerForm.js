import React, { useState } from 'react';
import Image from 'next/image';
import { db } from '../database/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import s from '../styles/signUp.module.css';

const RegisterForm = () => {  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || email === '' || password === '') {
      setError('Please enter username, email, and password');
      return;
    }

    try {
      console.log('Adding document to Firestore');
      const docRef = await addDoc(collection(db, 'users'), {
        username: username,
        email: email,
        password: password,
      });
      setSuccess('User registered successfully!');
      setError('');
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('Error adding document');
    }

    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className={s.all}>
      <Image src="/pig.png" width={100} height={100} className={s.image} alt="logo"/>
      <h2 className={s.signUp}>新規登録</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} className={s.container}>
        <div className={s.field}>
          <label htmlFor="username" className={s.label}>UserName</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={s.input}
          />
        </div>
        <div className={s.field}>
          <label htmlFor="email" className={s.label}>UserEmail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={s.input}
          />
        </div>
        <div className={s.field}>
          <label htmlFor="password" className={s.label}>PassWord</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={s.input}
          />
        </div>
        <button type="submit" className={s.button}>Register</button>
        {/* <button type="button" onClick={handleLogin }>ログインへ</button> */}
        {/* <Link to="/login">ログインへ</Link> */}
      </form>
    </div>
  );
};

export default RegisterForm;

