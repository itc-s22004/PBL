import React, { useEffect, useState } from 'react';
import '../styles/SlideInPanel.css';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../database/firebase.js';

const SlideInPanel = ({ isVisible, onClose, events, onEventDelete }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const fetchData = async () => {
        const postData = collection(db, "schedules");
        const snapshot = await getDocs(postData);
        const docData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setPosts(docData);
      };

      fetchData();
    }
  }, [isVisible]);

  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(db, "schedules", docId));
      console.log("Document successfully deleted!");
      setPosts(posts.filter(post => post.docId !== docId));
      onEventDelete(docId);
      alert("予定を削除しました");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`slide-in-panel ${isVisible ? 'visible' : ''}`}>
      <div className="panel-content">
        <button onClick={onClose}>Close</button>
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div key={index}>
              <h3>{event.title}</h3>
              <p>開始時刻: {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p>終了時刻: {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <button onClick={() => handleDelete(event.docId)}>削除</button>
            </div>
          ))
        ) : (
          <p>No events for this date</p>
        )}
      </div>
    </div>
  );
};

export default SlideInPanel;

