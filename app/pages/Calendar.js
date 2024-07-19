"use client"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fetchHolidays, parseHolidays } from '../Api/holiday';
import '../styles/Calendar.css';
import jaLocale from '@fullcalendar/core/locales/ja'; 

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const json = await fetchHolidays();
      if (json) {
        const parsedHolidays = parseHolidays(json);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="full-calendar-container">
        <div className="full-calendar">
          <FullCalendar 
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin
            ]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            events={events}
            locale={jaLocale}
            dayHeaderContent={(args) => {
              const dayOfWeek = args.date.getDay();
              let className = '';
              if (dayOfWeek === 0) {
                className = 'sunday-day';
              } else if (dayOfWeek === 6) {
                className = 'saturday-day';
              }
              return (
                <span className={className}>
                  {args.text}
                </span>
              );
            }}
            height="100%"
          />
        </div>
        <div className="input-area">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ここに文字を入力してください..."
            className="w-full h-32 p-2 border rounded"
          />
        </div>
      </main>
    </>
  );
}

/*"use client"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import '../styles/Calendar.css';
import jaLocale from '@fullcalendar/core/locales/ja'; 

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="full-calendar-container">
        <div className="full-calendar">
          <FullCalendar 
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin
            ]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            height="100%"
          />
        </div>
        <div className="input-area">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ここに文字を入力してください..."
            className="w-full h-32 p-2 border rounded"
          />
        </div>
      </main>
    </>
  );
}
*/
