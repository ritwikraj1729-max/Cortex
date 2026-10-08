import { AppProvider, useApp } from './store/AppStore';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuestPage } from './components/QuestPage';
import { StreaksPage } from './components/StreaksPage';
import { CalendarPage } from './components/CalendarPage';
import { JourneyPage } from './components/JourneyPage';
import { ReportingsPage } from './components/ReportingsPage';
import { DataPage } from './components/DataPage';
import { ToastHost } from './components/ui/ToastHost';

function Content() {
  const { activeSection } = useApp();
  switch (activeSection) {
    case 'dashboard':
      return <Dashboard />;
    case 'quest':
      return <QuestPage />;
    case 'streaks':
      return <StreaksPage />;
    case 'calendar':
      return <CalendarPage />;
    case 'journey':
      return <JourneyPage />;
    case 'reportings':
      return <ReportingsPage />;
    case 'data':
      return <DataPage />;
    default:
      return null;
  }
}

function Shell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0b10] text-slate-100">
      <Sidebar />
      <main className="h-full flex-1 overflow-hidden">
        <Content />
      </main>
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
