// pages/Calendar.js
"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useState } from 'react'
import '../styles/Calendar.css' // CSSファイルをインポート

export default function Calendar() {
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
              left: 'prev, next today',
              center: 'title',
              right: 'resourceTimelineWeek, dayGridMonth, timeGridWeek'
            }}
            height="100%" // カレンダーの高さを全画面に設定
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

