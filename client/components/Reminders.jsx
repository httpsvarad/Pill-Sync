import React, { useState } from "react";
import PrescriptionUploader from "./UploadPrescription";

const MedicineReminderDashboard = () => {
  const [reminders, setReminders] = useState([
    { id: 1, name: "Augmentin 625", time: "9:00 AM", active: true },
    { id: 2, name: "Rovor 10", time: "8:00 PM", active: false },
  ]);

  const toggleReminder = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
      )
    );
  };

//   const addReminder = () => {
//     const newReminder = {
//       id: reminders.length + 1,
//       name: `New Medicine ${reminders.length + 1}`,
//       time: "12:00 PM",
//       active: false,
//     };
//     setReminders([...reminders, newReminder]);
//   };

  return (
    <div className="min-h-screen w-full flex flex-col p-6">
    
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
        
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {reminders.map((reminder, index) => (
              <tr key={reminder.id} className="hover">
                <td>{index + 1}</td>
                <td>{reminder.name}</td>
                <td>{reminder.time}</td>
                <td>
                  <span
                    className={`badge ${
                      reminder.active ? "badge-success" : "badge-error"
                    }`}
                  >
                    {reminder.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={reminder.active}
                    onChange={() => toggleReminder(reminder.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      
<button className="btn btn-primary mt-3 w-32" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add Reminder</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
     
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Upload Your Prescription</h3>
    <PrescriptionUploader />
  </div>
</dialog>

    </div>
  );
};

export default MedicineReminderDashboard;
