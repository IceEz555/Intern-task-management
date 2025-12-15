import { CheckSquare, Folder, LayoutDashboard, LogOut, User, Users, LaptopMinimalCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Use role from context, fallback to Admin if not found
    const role = user?.role || 'Admin';

    const isActive = (path) => {
        return location.pathname === path ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    };

    const handleSignOut = () => {
        logout();
        navigate('/');
    };

    // Define menus for each role
    const menus = {
        Admin: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin-dashboard' },
            { icon: <Users size={20} />, label: 'User Management', path: '/admin/user-management' },
        ],
        PM: [
            { icon: <Folder size={20} />, label: 'Projects', path: '/project-management' },
            { icon: <LayoutDashboard size={20} />, label: 'My Kanban Board', path: '/personal-kanban' },
        ],
        Member: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/member-dashboard' }, // Placeholder for now
            { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/personal-kanban' }, // Assuming members can see personal board too?
        ]
    };

    const currentMenu = menus[role];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <LaptopMinimalCheck />
                    </div>
                    <span className="text-xl font-bold text-gray-900">TaskFlow</span>
                </div>
            </div>

            {/* Menu Section */}
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Menu
                    </h3>
                    <div className="space-y-1">
                        {currentMenu.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Account Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Account
                    </h3>
                    <div className="space-y-1">
                        <Link
                            to="/profile"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/profile')}`}
                        >
                            <User size={20} onClick={() => navigate('/profile')} />
                            Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sign Out Footer */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
