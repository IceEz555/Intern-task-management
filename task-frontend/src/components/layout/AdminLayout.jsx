import Sidebar from './Sidebar-component';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, namepage }) => {
    const { user } = useAuth();
    const name = user?.name || 'Guest';
    const role = user?.role || 'Guest';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Fixed) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Topbar (Sticky) */}
                <Topbar namepage={namepage} name={name} role={role} />

                {/* Page Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
