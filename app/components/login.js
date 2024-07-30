import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../database/firebase'; 
import { useNavigate, Link } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../database/firebase';
import '../styles/LoginForm.css';

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
    <div className="login-form">
      <h2>ログイン</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
        <Link to="/register">新規登録へ</Link>
      </form>
    </div>
  );
 
};

export default LoginForm;
