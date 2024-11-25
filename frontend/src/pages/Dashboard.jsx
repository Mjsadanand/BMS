import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    activeBillboards: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    totalCustomers: 0,  // Add this to store total customers
  });
  const [recentActivities, setRecentActivities] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false);

  // Dummy data to display in case of errors
  const dummyStats = {
    properties: 0,
    activeBillboards: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    totalCustomers: 0,  // Dummy data for totalCustomers
  };

  const dummyActivities = [
    {
      title: 'No Activity Yet',
      description: 'Add or update records to see recent activity here.',
      time: '-',
    },
  ];

  // Fetch stats and recent activities from the backend
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard-data');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setStats({
        properties: data.totalProperties,
        activeBillboards: data.activeBillboards,
        totalRevenue: data.totalRevenue,
        activeCustomers: data.activeCustomers,
        totalCustomers: data.totalCustomers,  // Ensure totalCustomers is updated here
      });
      setRecentActivities(data.recentActivities.length > 0 ? data.recentActivities : dummyActivities);
      setError(false); // Clear error state if fetch is successful
    } catch (err) {
      setStats(dummyStats); // Use dummy stats in case of failure
      setRecentActivities(dummyActivities); // Use dummy activities in case of failure
      setError(true);
      console.log(err);
    }
  };

  useEffect(() => {
    // Fetch data initially and periodically every 30 seconds
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
          <p className="text-2xl font-semibold mt-2">{stats.properties}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Billboards</h3>
          <p className="text-2xl font-semibold mt-2">{stats.activeBillboards}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold mt-2">${stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
          <p className="text-2xl font-semibold mt-2">{stats.totalCustomers}</p>  {/* Updated field */}
        </div>
        {/* <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
          <p className="text-2xl font-semibold mt-2">{stats.activeCustomers}</p>
        </div> */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {recentActivities.length === 0
              ? dummyActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))
              : recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
