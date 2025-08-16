'use client';
import { useEffect, useState } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { el, ja } from 'date-fns/locale';

function Modal({ isOpen, position, onClose }: { isOpen: boolean; position: {x: number, y: number}; onClose: () => void }) {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div 
        className="fixed bg-white p-4 rounded shadow w-96" 
        style={{
          left : position.x > 900 ? position.x - 580 : position.x,
          top : position.y,
        }}
        onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">タイトル</h2>
            <p>内容</p>
            <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onClose}
            >
            閉じる
            </button>
        </div>
     </div>
  );
}


export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [elements, setElements] = useState<Record<string, React.ReactNode>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [posi, setPosi] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: ja });
  const endDate = endOfWeek(monthEnd, { locale: ja });

  const dateFormat = 'd';
  const rows = [];
  const weekdays = 7;
  let days = [];
  console.log(posi.x, posi.y);

  for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
    for (let i = 0; i < weekdays; i++) {
      const cloneDay = day;
      const key = format(cloneDay, 'yyyy-MM-dd');
      days.push(
            <button
            key={day.toString()}
            className={`p-2 h-30 w-full border ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''}`}
            onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                setElements({[key]: <div className={`p-2 h-10 w-full bg-blue-500 text-white`}>予定</div>}); 
                setIsOpen(true); 
                setPosi({x: rect.right, y: rect.top});
            }}
            >
            {format(day, dateFormat, { locale: ja })}
            {elements[key]}
            </button>    
      );
      if (i != weekdays - 1) {
        day = addDays(day, 1);
      }
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">←</button>
        <h2 className="text-lg font-bold">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">→</button>
      </div>
      <div className="grid grid-cols-7 font-bold text-center mb-2">
        <div>日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div>土</div>
      </div>
      {rows}
      <Modal isOpen={isOpen} position={posi} onClose={() => setIsOpen(false)} />
    </div>
  );
}
