import React, { useState } from "react";
import PrescriptionUploader from "./UploadPrescription";

const MedicineReminderDashboard = () => {
  const [reminders, setReminders] = useState([
    { id: 1, name: "Take Vitamin C", time: "9:00 AM", active: true },
    { id: 2, name: "Blood Pressure Medicine", time: "8:00 PM", active: false },
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
      {/* <h1 className="text-4xl font-bold mb-6 text-primary">Medicine Reminders</h1> */}
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* Table Head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {/* Table Body */}
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
      
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn w-32" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add Reminder</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
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
