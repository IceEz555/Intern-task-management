const Topbar = ({ namepage, name, role }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Left: Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Workspace</span>
                <span className="text-gray-400">/</span>
                <span className="font-semibold text-gray-900">{namepage}</span>
            </div>

            {/* Right: Profile */}
            <div className="flex items-center gap-6">
                {/* Profile Dropdown */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                        {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
