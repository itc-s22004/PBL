import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fetchHolidays, parseHolidays } from '../Api/holiday';
import '../styles/Calendar.css';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../database/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import SlideInPanel from '../components/slideInPanel';

export default function Calendar() {
  const [inputValue, setInputValue] = useState('');
  const [holidayDates, setHolidayDates] = useState(new Set());
  const [dayBeforeHolidayDates, setDayBeforeHolidayDates] = useState(new Set());
  const [userName, setUserName] = useState('');
  const [events, setEvents] = useState([]);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const json = await fetchHolidays();
      if (json) {
        const parsedHolidays = parseHolidays(json);
        const holidayDatesSet = new Set(parsedHolidays.map(holiday => holiday.date));
        setHolidayDates(holidayDatesSet);

        const dayBeforeHolidayDatesSet = new Set(parsedHolidays.map(holiday => {
          const holidayDate = new Date(holiday.date);
          holidayDate.setDate(holidayDate.getDate() - 1);
          return holidayDate.toISOString().split('T')[0];
        }));
        setDayBeforeHolidayDates(dayBeforeHolidayDatesSet);
      }
    };

    fetchData();
  }, []);

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
    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const fetchedEvents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.username === userName) {
          const startTime = data.startTime.toDate();
          const endTime = data.endTime.toDate();
          const formattedStartTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
          const formattedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
          return {
            title: `${data.username} ${data.partTime}`,
            start: startTime,
            end: endTime,
          };
        }
        return null;
      }).filter(event => event !== null);
      setEvents(fetchedEvents);
    };

    if (userName) {
      fetchSchedules();
    }
  }, [userName]);

  const handleDateClick = (info) => {
    navigate(`/schedules?date=${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    const selectedDate = info.event.start.toISOString().split('T')[0];
    const eventsOnSelectedDate = events.filter(event => event.start.toISOString().split('T')[0] === selectedDate);
    setSelectedEvents(eventsOnSelectedDate);
    setIsPanelVisible(true);
  };

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  };

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
        <div className="user-info">
          <p>こんにちは、{userName}さん</p>
        </div>
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
            dayCellClassNames={(args) => {
              const dateStr = args.date.toISOString().split('T')[0];
              const isDayBeforeHoliday = dayBeforeHolidayDates.has(dateStr);
              let className = '';
              if (isDayBeforeHoliday) {
                className = 'holiday-day';
              }
              return className;
            }}
            events={events}
            height="100%"
            dateClick={handleDateClick}
            eventClick={handleEventClick} 
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
      <SlideInPanel isVisible={isPanelVisible} onClose={handleClosePanel} events={selectedEvents} />
    </>
  );
}
