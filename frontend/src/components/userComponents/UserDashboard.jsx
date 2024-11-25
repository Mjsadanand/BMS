import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import axios from 'axios';  // Import axios for API calls
import Dashboard from './Dashboard.jsx';
import Property from './Property.jsx';
import UserView from './UserView.jsx';
import {
    Bell,
    User,
    LayoutDashboard,
    Building2,
    Users,
    GitBranch, 
    Menu,
    ClipboardList,
} from 'lucide-react';

const UserDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);  // Manage notification bell hover
    const [showProfileMenu, setShowProfileMenu] = useState(false);  // Manage profile dropdown
    const [showProfileModal, setShowProfileModal] = useState(false); // Manage profile modal visibility
    const [profileDetails, setProfileDetails] = useState(null);  // State to store profile details
    const [isLoading, setIsLoading] = useState(true);  // State to track if data is still loading
    const [error, setError] = useState(null);  // Error handling state

    const [notifications] = useState([  // Example notifications array
        'New property added!',
        'Customer signed up.',
        'Branch status updated.',
        'New invoice generated.',
    ]);

    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: <Dashboard /> },
        { id: 'property', icon: <Building2 size={20} />, label: 'Property', component: <Property /> },
        { id: 'customer', icon: <Users size={20} />, label: 'View', component: <UserView /> },
        { id: 'branch', icon: <GitBranch size={20} />, label: 'Branch', component: <p>Branch content here</p> },
        { id: 'billboard', icon: <ClipboardList size={20} />, label: 'Billboard', component: <p>Bill content here</p> },
    ];

    const navigate = useNavigate();  // Hook to navigate to different routes

    // Fetch profile details from an API endpoint
    const fetchProfileDetails = async () => {
        try {
            const token = localStorage.getItem('token');  // Get the token if it's stored in localStorage
    
            // Replace '/api/account/profile' with your actual API endpoint
            const response = await axios.get('/api/account/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to headers if necessary
                },
            });
    
            // Set profile details into state
            setProfileDetails(response.data);
    
        } catch (err) {
            console.error('Error fetching profile details:', err);
            setError('Failed to load profile details.');  // Handle error gracefully
        } finally {
            setIsLoading(false);  // Set loading to false after request completes
        }
    };
    

    useEffect(() => {
        fetchProfileDetails();  // Fetch profile details when the component mounts
    }, []);  // Empty dependency array means this runs only once on component mount

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

    if (isLoading) {
        return <div>Loading...</div>;  // Show loading message while fetching profile
    }

    if (error) {
        return <div>{error}</div>;  // Show error if fetching profile failed
    }

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
                            <div>
                                {menuItems.find(item => item.id === currentPage)?.component}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Profile Modal */}
            {showProfileModal && profileDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
                        <div className="mb-4">
                            <strong>Name:</strong> {profileDetails.name}
                        </div>
                        <div className="mb-4">
                            <strong>Email:</strong> {profileDetails.email}
                        </div>
                        <div className="mb-4">
                            <strong>Role:</strong> {profileDetails.role || 'User'}
                        </div>
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
