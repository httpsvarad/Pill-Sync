import React, { useState } from "react";

const MedicineReminderApp = () => {
  // Simulated Gemini API data
  const initialData = [
    {
      name: "Augmentin",
      dosage: "625mg",
      schedule: ["morning", "evening"],
      duration: "5 days",
    },
    {
      name: "Enzoflam",
      dosage: null,
      schedule: ["morning", "evening"],
      duration: "5 days",
    },
    {
      name: "Pan-D",
      dosage: "40mg",
      schedule: ["morning"],
      duration: "5 days",
    },
    {
      name: "Hexigel gum paint",
      dosage: null,
      schedule: ["morning", "evening"],
      duration: "1 week",
    },
  ];

  const [medicines, setMedicines] = useState(initialData);

  // Handle changes in the medicine name or dosage
  const handleInputChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  // Handle changes to the schedule using checkboxes
  const handleScheduleChange = (index, time) => {
    const updatedMedicines = [...medicines];
    const schedule = updatedMedicines[index].schedule;
    if (schedule.includes(time)) {
      updatedMedicines[index].schedule = schedule.filter((t) => t !== time);
    } else {
      updatedMedicines[index].schedule = [...schedule, time];
    }
    setMedicines(updatedMedicines);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Editable Medicine Schedule
      </h1>
      {medicines.map((medicine, index) => (
        <div
          key={index}
          className="border-b py-4 flex flex-col gap-4 mb-4"
        >
          <div>
            <label className="block text-sm font-medium">Medicine Name:</label>
            <input
              type="text"
              value={medicine.name}
              onChange={(e) =>
                handleInputChange(index, "name", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dosage:</label>
            <input
              type="text"
              value={medicine.dosage || ""}
              onChange={(e) =>
                handleInputChange(index, "dosage", e.target.value)
              }
              placeholder="Enter dosage (e.g., 625mg)"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration:</label>
            <input
              type="text"
              value={medicine.duration}
              onChange={(e) =>
                handleInputChange(index, "duration", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium">Schedule:</label>
            {["morning", "afternoon", "evening"].map((time) => (
              <div key={time} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={medicine.schedule.includes(time)}
                  onChange={() => handleScheduleChange(index, time)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{time}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineReminderApp;
