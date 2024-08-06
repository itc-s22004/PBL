import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../database/firebase'; 
import { useNavigate, Link } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../database/firebase';
import s from '../styles/login.module.css';
import Image from 'next/image'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('ログイン成功！');
      navigate('/calendar');
    } catch (err) {
      setError('ログインに失敗しました');
    }
  };

  return (
    <>
    <div className={s.all}>
      <Image src="/pig.png" width={100} height={100} className={s.image} alt="logo"/>
      <h2 className={s.signIn}>ログイン</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} className={s.container}>
        <div className={s.field}>
          <label htmlFor="email" className={s.label}>メールアドレス:</label>
          <input
            type="email"
            id="email"
            value={email} 
	    className={s.input}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={s.field}>
          <label htmlFor="password" className={s.label}>パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            className={s.input}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
        <Link to="/register">新規登録へ</Link>
      </form>
    </div>
    </>
  );
 
};

export default LoginForm;
