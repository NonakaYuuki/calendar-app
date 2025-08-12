'use client';
import { useEffect, useState } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { el, ja } from 'date-fns/locale';


type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [elements, setElements] = useState<Record<string, React.ReactNode>>({});

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: ja });
  const endDate = endOfWeek(monthEnd, { locale: ja });

  const dateFormat = 'd';
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const key = format(cloneDay, 'yyyy-MM-dd');
      days.push(
        <button
          key={day.toString()}
          className={`p-2 h-30 w-full border ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''}`}
          onClick={() => setElements({[key]: <div className={`p-2 h-10 w-full bg-blue-500 text-white`}>予定</div>})}
        >
          {format(day, dateFormat, { locale: ja })}
          {elements[key]}
        </button>
      );
      day = addDays(day, 1);
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
    </div>
  );
}
