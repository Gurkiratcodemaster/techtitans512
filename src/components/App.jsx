import React, { useState } from 'react';

// The main application component.
const App = () => {
    // State to manage the current user and view
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Simulated user data. In a real application, this would come from an API.
    const users = {
        'student': { username: 'student', password: 'password', role: 'Student' },
        'teacher': { username: 'teacher', password: 'password', role: 'Teacher' },
        'admin': { username: 'admin', password: 'password', role: 'Admin' },
        'parent': { username: 'parent', password: 'password', role: 'Parent' }
    };

    // Handle form submission
    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const foundUser = users[username.toLowerCase()];

        if (foundUser && foundUser.password === password) {
            setUser(foundUser);
        } else {
            setError('Invalid username or password.');
        }
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        setUsername('');
        setPassword('');
    };

    // Render the login form
    const renderLoginForm = () => (
        <div className="dashboard-card">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
            {error && <p id="error-message" className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login</button>
            </form>
        </div>
    );

    // Render the appropriate dashboard based on user's role
    const renderDashboard = () => {
        let dashboardContent;

        switch(user.role) {
            case 'Student':
                dashboardContent = (
                    <div>
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Dashboard</h1>
                        <p className="text-gray-600 text-center">Welcome, Student! Here you can view your grades, assignments, and class schedule.</p>
                        <ul className="mt-8 space-y-4">
                            <li className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800">Grades</h3>
                                <p className="text-blue-600">Check your latest test scores and report card.</p>
                            </li>
                            <li className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800">Assignments</h3>
                                <p className="text-blue-600">See upcoming due dates and submit your work.</p>
                            </li>
                        </ul>
                    </div>
                );
                break;
            case 'Teacher':
                dashboardContent = (
                    <div>
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Teacher Dashboard</h1>
                        <p className="text-gray-600 text-center">Welcome, Teacher! Manage your classes, grades, and student information.</p>
                        <ul className="mt-8 space-y-4">
                            <li className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-green-800">Classes</h3>
                                <p className="text-green-600">Access your class lists and attendance records.</p>
                            </li>
                            <li className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-green-800">Gradebook</h3>
                                <p className="text-green-600">Enter and update grades for your students.</p>
                            </li>
                        </ul>
                    </div>
                );
                break;
            case 'Admin':
                dashboardContent = (
                    <div>
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
                        <p className="text-gray-600 text-center">Welcome, Admin! Manage users, school resources, and system settings.</p>
                        <ul className="mt-8 space-y-4">
                            <li className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-red-800">User Management</h3>
                                <p className="text-red-600">Add, edit, or remove student and teacher accounts.</p>
                            </li>
                            <li className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-red-800">Reports</h3>
                                <p className="text-red-600">Generate school-wide performance and attendance reports.</p>
                            </li>
                        </ul>
                    </div>
                );
                break;
            case 'Parent':
                dashboardContent = (
                    <div>
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Parent Dashboard</h1>
                        <p className="text-gray-600 text-center">Welcome, Parent! Stay up-to-date with your child's academic progress.</p>
                        <ul className="mt-8 space-y-4">
                            <li className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h3 className="font-semibold text-yellow-800">Child's Grades</h3>
                                <p className="text-yellow-600">View your child's grades in real time.</p>
                            </li>
                            <li className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h3 className="font-semibold text-yellow-800">Teacher Communication</h3>
                                <p className="text-yellow-600">Contact your child's teachers directly.</p>
                            </li>
                        </ul>
                    </div>
                );
                break;
            default:
                dashboardContent = <p className="text-center text-gray-600">Role not recognized.</p>;
        }

        return (
            <div className="dashboard-card">
                {dashboardContent}
                <div className="flex justify-center mt-8">
                    <button onClick={handleLogout} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">Logout</button>
                </div>
            </div>
        );
    };

    // Main render logic
    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div id="app" className="w-full flex justify-center">
                {user ? renderDashboard() : renderLoginForm()}
            </div>
        </div>
    );
};

export default App;
