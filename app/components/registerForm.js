import React, { useState } from 'react';
import Image from 'next/image';
import { db } from '../database/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Adding document to Firestore');
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        username: username,
        email: email,
        password: password,
      });
      setSuccess('登録が完了しました！');
      setError('');
      console.log('User registered with ID: ', user.uid);
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('登録が失敗しました！');
    }

    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
    <div className={s.all}>
      <Image src="/pig.png" width={100} height={100} className={s.image} alt="logo"/>
      <h2 className={s.signUp}>新規登録</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} className={s.container}>
        <div className={s.field}>
          <label htmlFor="username" className={s.label}>ユーザー名</label>
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
          <label htmlFor="email" className={s.label}>ユーザーメール</label>
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
          <label htmlFor="password" className={s.label}>パスワード</label>
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
        <Link to="/login" className={s.loginLink}>ログインへ→</Link>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;
