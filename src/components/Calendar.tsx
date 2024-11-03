import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import "../calendar.css";
import { DatesSetArg, EventContentArg } from '@fullcalendar/core';
import { Balance, CalendarContent, Transaction } from '../types';
import { calculateDailyBalance } from '../utils/financeCallculations';
import { formatCurrency } from '../utils/formatting';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns';

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMoth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay:string
  today:string,
  onDateClick:(dateInfo: DateClickArg) => void
}


const Calendar = ({ monthlyTransactions, setCurrentMoth, setCurrentDay ,currentDay,today,onDateClick}: CalendarProps) => {
  const theme=useTheme()

  const dailyBalances = calculateDailyBalance(monthlyTransactions);

  const createCalendarEvents = (dailyBalances: Record<string, Balance>): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  const handleDateSet = (dateSetInfo: DatesSetArg) => {
    const CurrentMoth = dateSetInfo.view.currentStart;
    setCurrentMoth(CurrentMoth);
    const todayDate=new Date();
    if(isSameMonth(todayDate,CurrentMoth)){
      setCurrentDay(today);
    }
  };

  const backgroundEvent={
    start:currentDay,
    display:"background",
    background: theme.palette.incomeColor.light
  }

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={[...calendarEvents,backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  );
};

export default Calendar;
