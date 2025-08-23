import React, { useState, useEffect } from 'react';
// [DIPERBAIKI] 'Checks' diubah lagi menjadi 'CheckCheck' yang benar
import { 
  CalendarDays, ChevronLeft, ChevronRight, CheckCircle, Info, Wind, 
  Droplet, Leaf, AlarmClock, ListTodo, CircleAlert, CalendarClock, CheckCheck
} from 'lucide-react';
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';

// =================================================================================
// Professional UI Components Tailored for this Page
// =================================================================================

const TaskMetricCard = ({ value, label, icon: Icon, color = "slate" }) => {
  const colors = {
    slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color].bg}`}>
          <Icon className={`w-6 h-6 ${colors[color].text}`} />
        </div>
      </div>
    </div>
  );
};

// ... TaskCalendar and UpcomingSchedule components remain the same ...

const TaskCalendar = ({ onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const today = new Date();

  const generateEventsForMonth = (year, month) => {
    const events = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isConventionalPeriod = year < 2024 || (year === 2024 && month < 8);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (isConventionalPeriod) {
            if ([10, 20, 30].includes(day)) events.push({ date, title: 'Apply Pesticide + Foliar', type: 'conventional', category: 'Agrochemicals' });
            if ([14, 24].includes(day)) events.push({ date, title: 'Apply Fertilizer', type: 'conventional', category: 'Fertilizer' });
        } else {
            if ([1, 15].includes(day)) events.push({ date, title: 'Apply Pesticide', type: 'regenerative', category: 'Pesticides' });
            if (day === 24) events.push({ date, title: 'Inject Microalgae', type: 'regenerative', category: 'Soil Agent' });
        }
    }
    return events;
  };
  
  const getEventsForDay = (day, allEvents) => {
      if (!day) return [];
      return allEvents.filter(event => event.date.getDate() === day);
  };
  
  const monthEvents = generateEventsForMonth(currentDate.getFullYear(), currentDate.getMonth());
  const navigateMonth = (direction) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  const goToToday = () => setCurrentDate(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const calendarDays = Array(startDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Task Schedule Calendar</h3>
        <div className="flex items-center gap-2">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5"/></button>
            <span className="font-semibold w-36 text-center">{currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5"/></button>
            <button onClick={goToToday} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Today</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-sm text-slate-600 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => {
          const events = getEventsForDay(day, monthEvents);
          const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
          return (
            <div key={index} className={`bg-white min-h-28 p-2 ${isToday ? 'bg-blue-50 border-2 border-blue-400' : ''}`}>
              <span className={`font-semibold ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{day}</span>
              <div className="space-y-1 mt-1">
                {events.map((event, i) => (
                    <div key={i} onClick={() => onEventClick(event)}
                      className={`text-xs text-white rounded px-1.5 py-1 truncate cursor-pointer ${event.type === 'conventional' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}>
                        {event.title}
                    </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const UpcomingSchedule = ({ events }) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const upcoming = events.filter(event => event.date >= today).sort((a,b) => a.date - b.date).slice(0,3);
    const getIconForCategory = (category) => {
        switch(category) {
            case 'Pesticides': return <Wind className="w-5 h-5 text-green-600"/>;
            case 'Soil Agent': return <Leaf className="w-5 h-5 text-green-600"/>;
            default: return <Droplet className="w-5 h-5 text-orange-600"/>
        }
    };
    const daysUntil = (date) => {
        const diffTime = date.getTime() - today.getTime(); const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today'; if (days === 1) return 'Tomorrow'; return `${days} days`;
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
             {upcoming.length > 0 ? (
                <div className="space-y-4"> {upcoming.map((event, i) => ( <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200"> <div className="bg-white p-3 rounded-lg border border-slate-200">{getIconForCategory(event.category)}</div> <div> <p className="font-bold text-slate-800">{event.title}</p> <p className="text-sm text-slate-500">{event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p> </div> <div className="ml-auto text-right"> <div className="font-bold text-green-600 text-lg flex items-center gap-1.5"><AlarmClock className="w-5 h-5"/> {daysUntil(event.date)}</div> </div> </div> ))} </div>
             ) : ( <p className="text-center text-slate-500 py-8">No upcoming tasks found in the schedule.</p> )}
        </div>
    );
}

// [UPDATED] The component has been renamed for clarity
const OverdueTasksCard = ({ tasks, onToggle }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Actionable Tasks (Overdue)</h3>
        {tasks.length > 0 ? (
            <ul className="space-y-3">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <button
                            onClick={() => onToggle(task.id)}
                            className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                                task.isCompleted
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-slate-300 hover:border-green-500'
                            }`}
                        >
                            {task.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-grow">
                             <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</p>
                             <p className={`text-sm ${task.isCompleted ? 'text-slate-400' : 'text-red-500'}`}>
                                Due: {task.date.toLocaleDateString('en-US')}
                             </p>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2"/>
                <p className="font-semibold text-slate-700">No Overdue Tasks</p>
                <p className="text-sm text-slate-500">You're all caught up. Great job!</p>
            </div>
        )}
    </div>
);


const TaskSchedulePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  
  useEffect(() => {
    let generatedEvents = [];
    const today = new Date();
    for(let i = -1; i < 12; i++) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const isConventional = year < 2024 || (year === 2024 && month < 8);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
             const date = new Date(year, month, day);
             const id = `${date.toISOString()}-${day}`;
             if (isConventional) {
                 if ([10, 20, 30].includes(day)) generatedEvents.push({ id, date, title: 'Apply Pesticide + Foliar', type: 'conventional', category: 'Agrochemicals', isCompleted: false });
                 if ([14, 24].includes(day)) generatedEvents.push({ id, date, title: 'Apply Fertilizer', type: 'conventional', category: 'Fertilizer', isCompleted: false });
             } else {
                 if ([1, 15].includes(day)) generatedEvents.push({ id, date, title: 'Apply Pesticide', type: 'regenerative', category: 'Pesticides', isCompleted: false });
                 if (day === 24) generatedEvents.push({ id, date, title: 'Inject Microalgae', type: 'regenerative', category: 'Soil Agent', isCompleted: false });
             }
        }
    }
    setAllEvents(generatedEvents);
  }, []);

  const handleToggleTask = (taskId) => {
    setAllEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === taskId
          ? { ...event, isCompleted: !event.isCompleted }
          : event
      )
    );
  };
  
  const today = new Date(); today.setHours(0,0,0,0);
  const oneWeekFromNow = new Date(); oneWeekFromNow.setDate(today.getDate() + 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const upcomingThisWeek = allEvents.filter(e => e.date >= today && e.date <= oneWeekFromNow).length;
  const overdueTasks = allEvents.filter(e => e.date < today && !e.isCompleted);
  const completedThisMonth = allEvents.filter(e => e.date >= startOfMonth && e.date <= endOfMonth && e.isCompleted).length;
  const totalTasksThisMonth = allEvents.filter(e => e.date >= startOfMonth && e.date <= endOfMonth).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} selectedGarden={"Site A (3 Acres)"} onGardenChange={() => {}} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <h1 className="text-3xl font-bold text-slate-800">Task Management Dashboard</h1>
          <p className="text-slate-500 mt-1 mb-6">Tracking and managing all scheduled farming activities for Site A.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <TaskMetricCard value={upcomingThisWeek} label="Upcoming (Next 7 Days)" icon={CalendarClock} color="yellow"/>
            <TaskMetricCard value={overdueTasks.length} label="Overdue Tasks" icon={CircleAlert} color="red"/>
            {/* [DIPERBAIKI] 'Checks' diubah menjadi 'CheckCheck' yang benar */}
            <TaskMetricCard value={completedThisMonth} label="Completed (This Month)" icon={CheckCheck} color="green"/>
            <TaskMetricCard value={totalTasksThisMonth} label="Total Tasks (This Month)" icon={ListTodo} color="slate"/>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                 <TaskCalendar onEventClick={(event) => alert(`Task: ${event.title}`)} />
              </div>
              <div className="flex flex-col gap-8">
                  <UpcomingSchedule events={allEvents.filter(e => !e.isCompleted)} />
                  <OverdueTasksCard tasks={overdueTasks} onToggle={handleToggleTask} />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskSchedulePage;