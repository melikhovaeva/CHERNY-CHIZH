import { cn } from '@/shared/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './DatePicker.module.scss';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${pad(d)}.${pad(m)}.${y}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday=0 ... Sunday=6
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  const days: { date: number; month: number; year: number }[] = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    days.push({ date: d, month: pm, year: py });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: d, month, year });
  }

  // Next month days to fill 6 rows
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    days.push({ date: d, month: nm, year: ny });
  }

  return days;
}

export interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  required,
  error,
  placeholder = 'ДД.ММ.ГГГГ',
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
  }, []);

  const selected = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return null;
    return { year: y, month: m - 1, date: d };
  }, [value]);

  const [viewYear, setViewYear] = useState(
    selected?.year ?? today.year,
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.month ?? today.month,
  );

  useEffect(() => {
    if (selected) {
      setViewYear(selected.year);
      setViewMonth(selected.month);
    }
  }, [selected]);

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const handleDayClick = useCallback(
    (day: { date: number; month: number; year: number }) => {
      const dateStr = `${day.year}-${pad(day.month + 1)}-${pad(day.date)}`;
      onChange(dateStr);
      setIsOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const hasError = !!error;

  return (
    <div className={cn([styles.root, className ?? ''])} ref={containerRef}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          type="text"
          readOnly
          className={cn([styles.input], {
            [styles.input_invalid]: hasError,
          })}
          value={formatDisplay(value)}
          placeholder={placeholder}
          onClick={() => setIsOpen((v) => !v)}
        />
        <svg
          className={styles.calendarIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={prevMonth}
                aria-label="Предыдущий месяц"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className={styles.monthYear}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={nextMonth}
                aria-label="Следующий месяц"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>

            <div className={styles.weekdays}>
              {WEEKDAYS.map((wd) => (
                <span key={wd} className={styles.weekday}>
                  {wd}
                </span>
              ))}
            </div>

            <div className={styles.days}>
              {days.map((day, idx) => {
                const isCurrentMonth = day.month === viewMonth;
                const isSelected =
                  selected &&
                  day.date === selected.date &&
                  day.month === selected.month &&
                  day.year === selected.year;
                const isToday =
                  day.date === today.date &&
                  day.month === today.month &&
                  day.year === today.year;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={cn([styles.day], {
                      [styles.day_otherMonth]: !isCurrentMonth,
                      [styles.day_selected]: !!isSelected,
                      [styles.day_today]: isToday && !isSelected,
                    })}
                    onClick={() => handleDayClick(day)}
                  >
                    {day.date}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footerRow}>
        <span
          className={cn([styles.error], {
            [styles.error_visible]: hasError,
          })}
          role={hasError ? 'alert' : undefined}
        >
          {error || '\u00A0'}
        </span>
      </div>
    </div>
  );
}
