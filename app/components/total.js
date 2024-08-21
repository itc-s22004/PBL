import React, { useEffect, useState } from 'react';
import { db } from '../database/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebase';
import styles from '../styles/total.module.css';
import { useNavigate } from 'react-router-dom';
import Image from 'next/image';

const Total = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [userName, setUserName] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [jobTotals, setJobTotals] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      if (userName) {
        const q = query(collection(db, 'schedules'), where('username', '==', userName));
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const startTime = data.startTime.toDate();
          const endTime = data.endTime.toDate();
          return {
            partTime: data.partTime,
            start: startTime,
            end: endTime,
            hourlyWage: data.hourlyWage
          };
        });

        const eventYears = [...new Set(events.map(event => event.start.getFullYear()))];
        setYears(eventYears);

        const filteredEvents = events.filter(event => event.start.getFullYear() === selectedYear);

        const monthlyAggregation = Array.from({ length: 12 }, (_, i) => ({ totalHours: 0, totalWage: 0 }));
        const jobAggregation = {};

        filteredEvents.forEach(event => {
          const month = event.start.getMonth();
          const hoursWorked = (event.end - event.start) / (1000 * 60 * 60);
          const wage = event.hourlyWage * hoursWorked;

          monthlyAggregation[month].totalHours += hoursWorked;
          monthlyAggregation[month].totalWage += wage;

          if (!jobAggregation[event.partTime]) {
            jobAggregation[event.partTime] = {
              totalWage: 0
            };
          }
          jobAggregation[event.partTime].totalWage += wage;
        });

        const aggregatedData = monthlyAggregation.map((data, index) => ({
          month: index + 1,
          totalHours: Math.floor(data.totalHours),
          totalWage: Math.floor(data.totalWage)
        }));

        setMonthlyData(aggregatedData);
        setJobTotals(jobAggregation);
      }
    };

    fetchData();
  }, [userName, selectedYear]);

  const goBack = () => {
    navigate(-1);
  };

  // 年間の合計時間と合計金額を計算
  const totalYearHours = monthlyData.reduce((sum, data) => sum + data.totalHours, 0);
  const totalYearWage = monthlyData.reduce((sum, data) => sum + data.totalWage, 0);

  return (
    <div className={styles.all}>
      <div className={styles.totalContainer}>
        <Image src="/left_icon.png" className={styles.back} height={30} width={30} alt="logo" onClick={goBack} />
        <h1 className={styles.totalHeader}>合計時間と合計金額</h1>
        <div className={styles.yearSelector}>
          {years.map(year => (
            <button
              key={year}
              className={selectedYear === year ? styles.selectedYear : styles.yearButton}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
        {monthlyData.length > 0 ? (
          <>
            <div className={styles.tablesContainer}>
              <table className={styles.totalTable}>
                <thead>
                  <tr>
                    <th>月</th>
                    <th>合計時間</th>
                    <th>合計金額</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(data => (
                    <tr key={data.month}>
                      <td>{data.month}月</td>
                      <td>{data.totalHours}時間</td>
                      <td>{data.totalWage}円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className={styles.totalTable}>
                <thead>
                  <tr>
                    <th>バイト名</th>
                    <th>合計金額</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(jobTotals).map(partTime => (
                    <tr key={partTime}>
                      <td>{partTime}</td>
                      <td>{Math.floor(jobTotals[partTime].totalWage)}円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 年間の合計を表示 */}
            <div className={styles.yearTotal}>
              <h3>年間合計時間: {totalYearHours}時間</h3>
              <h3>年間合計金額: {totalYearWage}円</h3>
            </div>
          </>
        ) : (
          <p className={styles.noData}>データがありません</p>
        )}
      </div>
    </div>
  );
};

export default Total;


// ----------------------------------------

// import React, { useEffect, useState } from 'react';
// import { db } from '../database/firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../database/firebase';
// import styles from '../styles/total.module.css';
// import { useNavigate } from 'react-router-dom';
// import Image from 'next/image';

// const Total = () => {
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [years, setYears] = useState([]);
//   const [jobTotals, setJobTotals] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserName(user.displayName || user.email || 'ユーザー');
//       } else {
//         setUserName('ログインしていません');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (userName) {
//         const q = query(collection(db, 'schedules'), where('username', '==', userName));
//         const querySnapshot = await getDocs(q);
//         const events = querySnapshot.docs.map(doc => {
//           const data = doc.data();
//           const startTime = data.startTime.toDate();
//           const endTime = data.endTime.toDate();
//           return {
//             partTime: data.partTime,
//             start: startTime,
//             end: endTime,
//             hourlyWage: data.hourlyWage
//           };
//         });

//         const eventYears = [...new Set(events.map(event => event.start.getFullYear()))];
//         setYears(eventYears);

//         const filteredEvents = events.filter(event => event.start.getFullYear() === selectedYear);

//         const monthlyAggregation = Array.from({ length: 12 }, (_, i) => ({ totalHours: 0, totalWage: 0 }));
//         const jobAggregation = {};

//         filteredEvents.forEach(event => {
//           const month = event.start.getMonth();
//           const hoursWorked = (event.end - event.start) / (1000 * 60 * 60);
//           const wage = event.hourlyWage * hoursWorked;

//           monthlyAggregation[month].totalHours += hoursWorked;
//           monthlyAggregation[month].totalWage += wage;

//           if (!jobAggregation[event.partTime]) {
//             jobAggregation[event.partTime] = {
//               totalWage: 0
//             };
//           }
//           jobAggregation[event.partTime].totalWage += wage;
//         });

//         const aggregatedData = monthlyAggregation.map((data, index) => ({
//           month: index + 1,
//           totalHours: Math.floor(data.totalHours),
//           totalWage: Math.floor(data.totalWage)
//         }));

//         setMonthlyData(aggregatedData);
//         setJobTotals(jobAggregation);
//       }
//     };

//     fetchData();
//   }, [userName, selectedYear]);

//   const goBack = () => {
//     navigate(-1);
//   };

//   // 年間の合計時間と合計金額を計算
//   const totalYearHours = monthlyData.reduce((sum, data) => sum + data.totalHours, 0);
//   const totalYearWage = monthlyData.reduce((sum, data) => sum + data.totalWage, 0);

//   return (
//     <div className={styles.all}>
//       <div className={styles.totalContainer}>
//         <Image src="/left_icon.png" className={styles.back} height={30} width={30} alt="logo" onClick={goBack} />
//         <h1 className={styles.totalHeader}>合計時間と合計金額</h1>
//         <div className={styles.yearSelector}>
//           {years.map(year => (
//             <button
//               key={year}
//               className={selectedYear === year ? styles.selectedYear : styles.yearButton}
//               onClick={() => setSelectedYear(year)}
//             >
//               {year}
//             </button>
//           ))}
//         </div>
//         {monthlyData.length > 0 ? (
//           <>
//             <table className={styles.totalTable}>
//               <thead>
//                 <tr>
//                   <th>月</th>
//                   <th>合計時間</th>
//                   <th>合計金額</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {monthlyData.map(data => (
//                   <tr key={data.month}>
//                     <td>{data.month}月</td>
//                     <td>{data.totalHours}時間</td>
//                     <td>{data.totalWage}円</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <h2 className={styles.jobHeader}>バイトごとの合計金額</h2>
//             <table className={styles.totalTable}>
//               <thead>
//                 <tr>
//                   <th>バイト名</th>
//                   <th>合計金額</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(jobTotals).map(partTime => (
//                   <tr key={partTime}>
//                     <td>{partTime}</td>
//                     <td>{Math.floor(jobTotals[partTime].totalWage)}円</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* 年間の合計を表示 */}
//             <div className={styles.yearTotal}>
//               <h3>年間合計時間: {totalYearHours}時間</h3>
//               <h3>年間合計金額: {totalYearWage}円</h3>
//             </div>
//           </>
//         ) : (
//           <p className={styles.noData}>データがありません</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Total;



// -----------------------------


// import React, { useEffect, useState } from 'react';
// import { db } from '../database/firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../database/firebase';
// import styles from '../styles/total.module.css';
// import { useNavigate } from 'react-router-dom';
// import Image from 'next/image';

// const Total = () => {
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [years, setYears] = useState([]);
//   const [jobTotals, setJobTotals] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserName(user.displayName || user.email || 'ユーザー');
//       } else {
//         setUserName('ログインしていません');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (userName) {
//         const q = query(collection(db, 'schedules'), where('username', '==', userName));
//         const querySnapshot = await getDocs(q);
//         const events = querySnapshot.docs.map(doc => {
//           const data = doc.data();
//           const startTime = data.startTime.toDate();
//           const endTime = data.endTime.toDate();
//           return {
//             partTime: data.partTime,
//             start: startTime,
//             end: endTime,
//             hourlyWage: data.hourlyWage
//           };
//         });

//         const eventYears = [...new Set(events.map(event => event.start.getFullYear()))];
//         setYears(eventYears);

//         const filteredEvents = events.filter(event => event.start.getFullYear() === selectedYear);

//         const monthlyAggregation = Array.from({ length: 12 }, (_, i) => ({ totalHours: 0, totalWage: 0 }));
//         const jobAggregation = {};

//         filteredEvents.forEach(event => {
//           const month = event.start.getMonth();
//           const hoursWorked = (event.end - event.start) / (1000 * 60 * 60);
//           const wage = event.hourlyWage * hoursWorked;

//           monthlyAggregation[month].totalHours += hoursWorked;
//           monthlyAggregation[month].totalWage += wage;

//           if (!jobAggregation[event.partTime]) {
//             jobAggregation[event.partTime] = {
//               totalWage: 0
//             };
//           }
//           jobAggregation[event.partTime].totalWage += wage;
//         });

//         const aggregatedData = monthlyAggregation.map((data, index) => ({
//           month: index + 1,
//           totalHours: Math.floor(data.totalHours),
//           totalWage: Math.floor(data.totalWage)
//         }));

//         setMonthlyData(aggregatedData);
//         setJobTotals(jobAggregation);
//       }
//     };

//     fetchData();
//   }, [userName, selectedYear]);

//   const goBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className={styles.all}>
//       <div className={styles.totalContainer}>
//         <Image src="/left_icon.png" className={styles.back} height={30} width={30} alt="logo" onClick={goBack} />
//         <h1 className={styles.totalHeader}>合計時間と合計金額</h1>
//         <div className={styles.yearSelector}>
//           {years.map(year => (
//             <button
//               key={year}
//               className={selectedYear === year ? styles.selectedYear : styles.yearButton}
//               onClick={() => setSelectedYear(year)}
//             >
//               {year}
//             </button>
//           ))}
//         </div>
//         {monthlyData.length > 0 ? (
//           <>
//             <table className={styles.totalTable}>
//               <thead>
//                 <tr>
//                   <th>月</th>
//                   <th>合計時間</th>
//                   <th>合計金額</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {monthlyData.map(data => (
//                   <tr key={data.month}>
//                     <td>{data.month}月</td>
//                     <td>{data.totalHours}時間</td>
//                     <td>{data.totalWage}円</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* <h3></h3> */}
//             <h2 className={styles.jobHeader}>バイトごとの合計金額</h2>
//             <table className={styles.totalTable}>
//               <thead>
//                 <tr>
//                   <th>バイト名</th>
//                   <th>合計金額</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(jobTotals).map(partTime => (
//                   <tr key={partTime}>
//                     <td>{partTime}</td>
//                     <td>{Math.floor(jobTotals[partTime].totalWage)}円</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         ) : (
//           <p className={styles.noData}>データがありません</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Total;