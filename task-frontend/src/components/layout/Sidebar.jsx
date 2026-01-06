import { useState } from 'react';
import { CheckSquare, Folder, LayoutDashboard, LogOut, User, Users, LaptopMinimalCheck, BotMessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Use role from context, fallback to Admin if not found
    const role = user?.role || 'Admin';

    const isActive = (path) => {
        return location.pathname === path ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    };

    const handleSignOutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        await logout();
        navigate('/login');
    };

    const [isAiErrorModalOpen, setIsAiErrorModalOpen] = useState(false);

    const handleAIChatClick = async (e) => {
        e.preventDefault();
        try {
            // Ping the service with a short timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            await fetch("http://localhost:8501", {
                mode: 'no-cors',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            window.open("http://localhost:8501", "_blank");
        } catch (error) {
            console.error("AI Service Unavailable", error);
            setIsAiErrorModalOpen(true);
        }
    };

    // Define menus for each role
    const menus = {
        Admin: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin-dashboard' },
            { icon: <Users size={20} />, label: 'User Management', path: '/admin/user-management' },
        ],
        PM: [
            { icon: <Folder size={20} />, label: 'Projects', path: '/project-management' },
            { icon: <LayoutDashboard size={20} />, label: 'My Board', path: '/personal-kanban' },
        ],
        Member: [
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/member-dashboard' },
            { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/member-task' },
            { icon: <LayoutDashboard size={20} />, label: 'My Board', path: '/personal-kanban' },
        ]
    };

    const currentMenu = menus[role] || [];

    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-30">
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
                                <User size={20} />
                                Profile
                            </Link>
                        </div>
                        <div className='space-y-1'>
                            <button
                                onClick={handleAIChatClick}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                            >
                                <BotMessageSquare size={20} />
                                AI Chat
                            </button>
                        </div>
                    </div>

                </div>

                {/* Sign Out Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleSignOutClick}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <Modal
                open={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
                size="sm"
            >
                <div className="flex flex-col">
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to log out? You will need to sign in again to access your account.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </Modal>

            {/* AI Service Error Modal */}
            <Modal
                open={isAiErrorModalOpen}
                onClose={() => setIsAiErrorModalOpen(false)}
                title="Service Unavailable"
                size="sm"
            >
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <BotMessageSquare size={24} />
                        <span className="font-semibold">AI Assistant is currently offline</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                        The AI Chat service is not responding. This usually means the local server is not running.
                        <br /><br />
                        Please check valid url or contact support.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsAiErrorModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Sidebar;
