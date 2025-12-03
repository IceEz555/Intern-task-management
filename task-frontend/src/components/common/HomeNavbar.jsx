import { Link } from 'react-router-dom';
import { LaptopMinimalCheck } from 'lucide-react';
const HomeNavbar = () => {
    return (
        <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20">
                        <LaptopMinimalCheck />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-6">
                    <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5">
                        Get Started
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default HomeNavbar;