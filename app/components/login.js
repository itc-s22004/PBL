// "use client";

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { getDocs, collection, query, where } from 'firebase/firestore';
// import { db } from '../database/firebase';
// import '../styles/LoginForm.css';

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (email === '' || password === '') {
//       setError('Please enter both email and password');
//       return;
//     }

//     try {
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('email', '==', email), where('password', '==', password));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         setError('');
//         navigate('/calendar');
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Error checking user credentials:', error);
//       setError('Failed to log in: ' + error.message);
//     }
//   };

//   return (
//     <div className="login-form">
//       <h2>ログイン</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="email">メールアドレス:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">パスワード:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">ログイン</button>
//       </form>
//       <Link to="/register" className="register-link">新規登録へ→</Link>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../database/firebase'; // 正しいパスでインポート
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
      // ログイン成功後の処理をここに追加
      alert('ログイン成功！');
      navigate('/calendar'); // ログイン成功後にカレンダー画面に移動
    } catch (err) {
      setError('ログインに失敗しました');
    }
  };

  return (
    <>
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
        {/* <button type="button" onClick={handleRegister}>新規登録へ</button> */}
        {/* <Link to="/register">新規登録へ</Link> */}
        <Link to="/register">新規登録へ</Link>
      </form>
    </div>
    </>
  );
 
};

export default LoginForm;