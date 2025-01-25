import React from 'react'
import MedicineReminderDashboard from './Reminders'
import useStore from '../store/useStore'



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
                        <div className='p-6'>
                            Hey {user?.name}
                        </div>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Drawer