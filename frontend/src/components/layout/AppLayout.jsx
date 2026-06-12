import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

const AppLayout = () => {
  return (
    <div className="flex justify-center h-[100dvh] bg-black overflow-hidden">
      {/* Mobile App Container */}
      <div className="w-full max-w-md h-full bg-background flex flex-col relative shadow-2xl overflow-hidden border-x-0 sm:border-x sm:border-white/10">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scroll-smooth">
          <div className="p-4">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
