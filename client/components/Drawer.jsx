import React from 'react'
import MedicineReminderDashboard from './Reminders'
import useStore from '../store/useStore'
import userpng from '../assets/user.png'



const Drawer = () => {
    const { user } = useStore();
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">
                    {/* Page content here */}
                    <div className='w-full'>
                        <MedicineReminderDashboard />
                    </div>
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        {/* Sidebar content here */}

                        <div className="p-8 max-w-lg mx-auto bg-gray-50 rounded-2xl shadow-lg space-y-6">
    {/* Profile Picture */}
    <div className="flex justify-center">
        <img
            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg"
            src={userpng}
            alt={`${user?.name || 'User'}'s profile`}
        />
    </div>

    {/* Name and Greeting */}
    <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Hello {user?.name || 'User'}!</h2>
        <p className="text-base text-gray-600">Welcome back! Here's a quick look at your profile.</p>
    </div>

    {/* User Details */}
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Email:</span>
            <span className="text-sm text-gray-900 font-medium">example@example.com</span>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Phone:</span>
            <span className="text-sm text-gray-900 font-medium">8574392001</span>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Joined:</span>
            <span className="text-sm text-gray-900 font-medium">Jan 25, 2025</span>
        </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-center mt-6">
        <button className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300">
            Edit Profile
        </button>
    </div>
</div>


                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Drawer