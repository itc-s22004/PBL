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
              <p>Start: {event.start.toLocaleString()}</p>
              <p>End: {event.end.toLocaleString()}</p>
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
