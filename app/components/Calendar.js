import React, { useState, useEffect, useRef } from 'react';
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
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import SlideInPanel from '../components/slideInPanel';
import { doc, deleteDoc } from "firebase/firestore";



export default function Calendar() {
  const [inputValue, setInputValue] = useState('');
  const [holidayDates, setHolidayDates] = useState(new Set());
  const [dayBeforeHolidayDates, setDayBeforeHolidayDates] = useState(new Set());
  const [userName, setUserName] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [totalHourlyWage, setTotalHourlyWage] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [partTime, setPartTime] = useState("");
  const [newJobName, setNewJobName] = useState("");
  const [newJobStartTime, setNewJobStartTime] = useState("");
  const [newJobEndTime, setNewJobEndTime] = useState("");
  const [newJobHourlyWage, setNewJobHourlyWage] = useState("");
  const [partTimeOptions, setPartTimeOptions] = useState([""]);
  const navigate = useNavigate();
  const isScrolling = useRef(false);



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
  const fetchPartTimeOptions = async () => {
    const q = query(collection(db, 'partTimes'), where('username', '==', userName));
    const querySnapshot = await getDocs(q);
    const options = querySnapshot.docs.map(doc => doc.data().name);
    setPartTimeOptions(["", ...options]);
  };

  if (userName) {
    fetchPartTimeOptions();
  }
}, [userName]);


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
    const q = query(collection(db, 'schedules'), where('username', '==', userName));
    const querySnapshot = await getDocs(q);
    const fetchedEvents = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const startTime = data.startTime.toDate();
      const endTime = data.endTime.toDate();
      return {
        title: `${data.partTime}`,
        start: startTime,
        end: endTime,
        partTime: data.partTime,
        hourlyWage: data.hourlyWage,
	docId: doc.id
      };
    });
    setEvents(fetchedEvents);
    setFilteredEvents(fetchedEvents);
  };

  if (userName) {
    fetchSchedules();
  }
}, [userName]);


  useEffect(() => {
    const calculateTotalHourlyWage = () => {
      const totalWage = filteredEvents.reduce((total, event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const hoursWorked = (end - start) / (1000 * 60 * 60);
        return total + (event.hourlyWage * hoursWorked || 0) ;
      }, 0);
      setTotalHourlyWage(Math.floor(totalWage));
    };

    calculateTotalHourlyWage();
  }, [filteredEvents]);

  const handleDateClick = (info) => {
    if (!isScrolling.current) {
      navigate(`/schedules?date=${info.dateStr}`);
    }
  };

  const handleEventClick = (info) => {
    if (!isScrolling.current) {
      const selectedDate = info.event.start.toISOString().split('T')[0];
      const eventsOnSelectedDate = events.filter(event => event.start.toISOString().split('T')[0] === selectedDate);
      setSelectedEvents(eventsOnSelectedDate);
      setIsPanelVisible(true);
    }
  };

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  };

  const handleCustomButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleAddButtonClick = () => {
    setIsAddJobModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (partTime) {
      const filtered = partTime === "" ? events : events.filter(event => event.partTime === partTime);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); 
    }
  };

  const handlePartTimeChange = (event) => {
    setPartTime(event.target.value); 
  };

  const handleNewJobNameChange = (event) => {
    setNewJobName(event.target.value);
  };

  const handleNewJobStartTimeChange = (event) => {
    setNewJobStartTime(event.target.value);
  };

  const handleNewJobEndTimeChange = (event) => {
    setNewJobEndTime(event.target.value);
  };

  const handleNewJobHourlyWageChange = (event) => {
    setNewJobHourlyWage(event.target.value);
  };

  const handleAddJob = async () => {
  if (newJobName && newJobHourlyWage) {
    try {
      await addDoc(collection(db, 'partTimes'), { 
        name: newJobName,
        hourlyWage: Number(newJobHourlyWage),
        username: userName
      });
      setPartTimeOptions(prevOptions => {
        if (!prevOptions.includes(newJobName)) {
          return [...prevOptions, newJobName];
        }
        return prevOptions;
      });
      setNewJobName("");
      setNewJobStartTime("");
      setNewJobEndTime("");
      setNewJobHourlyWage("");
      setIsAddJobModalOpen(false);
    } catch (error) {
      console.error("Error adding job: ", error);
    }
  }
};


  const handleDatesSet = (dateInfo) => {
    const startOfMonth = new Date(dateInfo.view.currentStart.getFullYear(), dateInfo.view.currentStart.getMonth(), 1);
    const endOfMonth = new Date(dateInfo.view.currentStart.getFullYear(), dateInfo.view.currentStart.getMonth() + 1, 0);

    const filtered = events.filter(event => {
      const eventDate = new Date(event.start);
      return (eventDate >= startOfMonth && eventDate <= endOfMonth);
    });

    setFilteredEvents(filtered);
  };

  const handleScrollStart = () => {
    isScrolling.current = true;
  };

  const handleScrollEnd = () => {
    setTimeout(() => {
      isScrolling.current = false;
    }, 100); 
  };

  const handleEventDelete = (docId) => {
    setEvents(events.filter(event => event.docId !== docId));
    setFilteredEvents(filteredEvents.filter(event => event.docId !== docId));
  };

  return (
    <>
      <main className="full-calendar-container">
        <div className="full-calendar">
          <FullCalendar 
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin
            ]}
            headerToolbar={{
              left: 'prev,next today myCustomButton myAddButton',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            customButtons={{
              myCustomButton: {
                text: '表示',
                click: handleCustomButtonClick
              },
              myAddButton: {
                text: '追加',
                click: handleAddButtonClick
              }
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
            events={filteredEvents}
            height="100%"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
          />
        </div>
        <div className="input-area">
          <p className="total-hourly-wage">現在の給料: {totalHourlyWage}円</p>
        </div>
      </main>
      <SlideInPanel isVisible={isPanelVisible} onClose={handleClosePanel} events={selectedEvents} onEventDelete={handleEventDelete} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>表示するバイトを選んだください</h2>
            <select
              value={partTime}
              onChange={handlePartTimeChange}
              required
            >
              <option value="">何も選択しない</option>
              {partTimeOptions.slice(1).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button onClick={handleModalClose}>Save</button>
          </div>
        </div>
      )}
      {isAddJobModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddJobModalOpen(false)}>&times;</span>
            <h2>新しいバイトの情報を入力してください</h2>
            <input 
              type="text" 
              value={newJobName} 
              onChange={handleNewJobNameChange}
              placeholder="バイト名"
            />
            <input 
              type="number" 
              value={newJobHourlyWage} 
              onChange={handleNewJobHourlyWageChange}
              placeholder="時給"
            />
            <button onClick={handleAddJob}>追加</button>
          </div>
        </div>
      )}
    </>
  );
}
