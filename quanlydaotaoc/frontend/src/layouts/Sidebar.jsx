import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { MENU_ITEMS } from '../constants/menuConfig';

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    // Logic lọc menu theo Role
    const filteredMenu = MENU_ITEMS.filter((item) =>
        item.roles.some((role) => user?.roles?.includes(role))
    );

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shadow-xl">
            <div className="p-6 text-2xl font-black text-blue-500 tracking-tighter border-b border-slate-800">
                STD MANAGER
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                {filteredMenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3.5 mb-1 transition-all duration-200 hover:bg-slate-800 hover:text-white ${isActive
                                ? 'bg-blue-600 text-white border-r-4 border-blue-300 font-bold'
                                : 'text-slate-400'
                                }`}
                        >
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                v1.0.0-PROJ2
            </div>
        </aside>
    );
};

export default Sidebar;