import React from 'react';
import '../styles/SlideInPanel.css';

const SlideInPanel = ({ isVisible, onClose, events }) => {
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
	      <button>編集</button>
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
