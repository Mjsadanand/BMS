import { useState,  } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Dashboard from '../pages/Dashboard.jsx';
import {
    Bell,
    User,
    LayoutDashboard,
    Building2,
    Users,
    GitBranch, 
    UserCircle,
    MapPin,
    FileText,
    Menu
} from 'lucide-react';
import Property from './Property.jsx';
import Customer from './CustomerManagement.jsx';
import Staff from './Staff.jsx';
import Billboard from './Billboard.jsx';   
import AdContractManagement from './AdContractManagement.jsx';
import Advertise from './Advertise.jsx';
import Invoice from './Invoice.jsx';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);  // Manage notification bell hover
    const [showProfileMenu, setShowProfileMenu] = useState(false);  // Manage profile dropdown
    const [showProfileModal, setShowProfileModal] = useState(false); // Manage profile modal visibility

    const [notifications] = useState([  // Example notifications array
        'New property added!',
        'Customer signed up.',
        'Branch status updated.',
        'New invoice generated.',
    ]);

    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: <Dashboard /> },
        { id: 'property', icon: <Building2 size={20} />, label: 'Property', component: <Property /> },
        { id: 'customer', icon: <Users size={20} />, label: 'Clients', component: <Customer /> },
        { id: 'billboard', icon: <GitBranch size={20} />, label: 'Billboard', component: <Billboard/> },
        { id: 'staff', icon: <UserCircle size={20} />, label: 'Staff', component: <Staff /> },
        { id: 'advertise', icon: <UserCircle size={20} />, label: 'Advertise', component: <Advertise /> },
        { id: 'contract', icon: <MapPin size={20} />, label: 'Contract', component: <AdContractManagement/> },
        { id: 'invoice', icon: <FileText size={20} />, label: 'Invoice', component: <Invoice /> },
    ];

    // Fetch profile details from localStorage
    const getProfileDetails = () => {
        const profile = JSON.parse(localStorage.getItem('userProfile'));
        return profile ? profile : { name: 'Guest', email: 'guest@example.com', role: 'Visitor' }; // Default for guest
    };

    // eslint-disable-next-line no-unused-vars
    const [profileDetails, setProfileDetails] = useState(getProfileDetails);

    // Add navigation hook
    const navigate = useNavigate();  // Hook to navigate to different routes

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleViewProfile = () => {
        setShowProfileModal(true);  // Open the profile modal
        setShowProfileMenu(false);  // Close the dropdown menu
    }; 

    const handleLogout = () => {
        // Logout functionality: Clear session, tokens, etc.
        localStorage.clear();  // Clear session data or authentication tokens

        // Redirect to the homepage (or login page)
        navigate('/');  // This will navigate to the homepage ("/")
    };

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            {/* Header */}
            <header className="flex-none h-16 bg-white border-b">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">Billboard Management System</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button 
                            onMouseEnter={() => setShowNotifications(true)} 
                            onMouseLeave={() => setShowNotifications(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg w-72 p-4 z-10">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                                <ul className="space-y-2">
                                    {notifications.map((notification, index) => (
                                        <li key={index} className="text-sm text-gray-700">
                                            {notification}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Profile Icon */}
                        <button 
                            onClick={handleProfileClick}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                        >
                            <User className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg w-48 p-4 z-10">
                                <ul>
                                    <li className="text-sm text-gray-700 mb-2">
                                        <button onClick={handleViewProfile} className="w-full text-left">View Profile</button>
                                    </li>
                                    <li className="text-sm text-gray-700">
                                        <button onClick={handleLogout} className="w-full text-left">Logout</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`flex-none bg-white border-r transition-all duration-300 overflow-y-auto ${isSidebarOpen ? 'w-64' : 'w-20'}`}
                >
                    <nav className="p-3 h-full">
                        <ul className="space-y-1">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setCurrentPage(item.id)}
                                        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${currentPage === item.id
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {item.icon}
                                        {isSidebarOpen && (
                                            <span className="font-medium truncate">{item.label}</span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="p-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {menuItems.find(item => item.id === currentPage)?.label}
                                </h2>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                {menuItems.find(item => item.id === currentPage)?.component}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Profile Modal (Popup) */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Details</h2>
                        <p><strong>Name:</strong> {profileDetails.name}</p>
                        <p><strong>Email:</strong> {profileDetails.email}</p>
                        <p><strong>Role:</strong> {profileDetails.role}</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setShowProfileModal(false)} className="py-2 px-4 bg-gray-600 text-white rounded-lg">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
