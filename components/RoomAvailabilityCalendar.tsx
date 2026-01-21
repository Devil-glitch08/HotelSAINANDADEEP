
import React, { useState } from 'react';
import { MOCK_OCCUPANCY, TOTAL_HOTEL_ROOMS } from '../constants';

const RoomAvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = [];
  // Fill empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 md:h-20 border border-stone-50 bg-stone-50/30"></div>);
  }

  // Fill days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const bookedRooms = MOCK_OCCUPANCY[dateStr] || 0;
    const isFull = bookedRooms >= TOTAL_HOTEL_ROOMS;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));

    days.push(
      <div 
        key={day} 
        className={`relative h-16 md:h-20 border border-stone-50 p-2 transition-all duration-300 group ${
          isPast ? 'bg-stone-50/50 opacity-40 cursor-not-allowed' : 'bg-white hover:bg-amber-50/50 cursor-pointer'
        } ${isFull && !isPast ? 'bg-red-50/30' : ''}`}
      >
        <div className="flex justify-between items-start">
           <span className={`text-xs md:text-sm font-bold ${isToday ? 'bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md' : 'text-slate-600'}`}>
            {day}
          </span>
          {isFull && !isPast && (
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse md:hidden"></span>
          )}
        </div>
        
        {!isPast && (
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            {isFull ? (
              <div className="flex flex-col">
                <div className="w-full h-1 md:h-1.5 bg-red-500 rounded-full shadow-sm"></div>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-[7px] md:text-[8px] text-red-600 font-black uppercase tracking-tighter">Hotel Full</span>
                   <span className="text-[7px] md:text-[8px] text-red-400 font-bold hidden md:block">8/8</span>
                </div>
              </div>
            ) : bookedRooms > 0 ? (
              <div className="flex flex-col">
                <div className="w-full h-1 md:h-1.5 bg-amber-400 rounded-full shadow-sm overflow-hidden">
                  <div 
                    className="h-full bg-amber-600" 
                    style={{ width: `${(bookedRooms / TOTAL_HOTEL_ROOMS) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-[7px] md:text-[8px] text-amber-600 font-black uppercase tracking-tighter">Few Left</span>
                   <span className="text-[7px] md:text-[8px] text-amber-500 font-bold hidden md:block">{bookedRooms}/8</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="w-full h-1 md:h-1.5 bg-emerald-400 rounded-full shadow-sm"></div>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-[7px] md:text-[8px] text-emerald-600 font-black uppercase tracking-tighter">Open</span>
                   <span className="text-[7px] md:text-[8px] text-emerald-500 font-bold hidden md:block">0/8</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden">
      <div className="p-6 md:p-8 bg-stone-900 flex justify-between items-center text-white border-b border-white/5">
        <div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-400">{monthName}</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">{year}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase text-slate-400 py-2 tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l border-t border-stone-50">
          {days}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Full (8/8)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Partially Booked</span>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[9px] italic text-slate-400 font-medium">8 Total Rooms Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityCalendar;
