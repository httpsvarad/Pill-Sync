import React, { useState } from "react";
import axios from "axios";
import useStore from "../store/useStore";
import { Link } from "react-router-dom";

const PrescriptionUploader = () => {
    const [image, setImage] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const { user, sendSMS } = useStore();
    const userId = user?._id;

    const sendReminder = async () => {
        // setLoading(true);
        // setMessage("");

        // Fixed data for testing
        // const requestData = {
        //     name: "John Doe",
        //     medications: [
        //         { name: "Paracetamol", dosage: "500mg", schedule: "9:00 AM" },
        //         { name: "Ibuprofen", dosage: "200mg", schedule: "6:00 PM" }
        //     ]
        // };

        try {
            await sendSMS();
        } catch (error) {
            console.error("Error sending reminder:", error);
            // setMessage("Failed to send reminders.");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            setStatusMessage("User not logged in. Please log in to upload prescriptions.");
            return;
        }

        if (!image) {
            setStatusMessage("Please select an image to upload.");
            return;
        }

        setStatusMessage("");
        setIsUploading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/upload", {
                userId,
                image,
            });

            if (response.data.success) {
                setStatusMessage("Prescription uploaded successfully!");

            } else {
                setStatusMessage("Failed to upload prescription: " + response.data.message);
            }
            console.log(response.data.aiResponseText);
        } catch (error) {
            console.error("Error uploading prescription:", error);
            setStatusMessage("An error occurred while uploading the prescription. Please try again.");
        } finally {
            setIsUploading(false);
        }


    };



    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div >
                {/* <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Upload Prescription</h2> */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {/* <label
                            htmlFor="image"
                            className="block text-lg font-medium text-gray-700 mb-3"
                        >
                            Prescription Image:
                        </label> */}
                        <input onChange={handleImageChange} type="file" className="file-input w-full" />
                    </div>
                    <button
                        type="submit"
                        className={`w-full cursor-pointer py-2 px-3 rounded-lg text-white font-semibold transition-all duration-300 ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"}`}
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
                {statusMessage && (
                    <p
                        className={`mt-4 text-sm text-center ${isUploading ? "text-gray-600" : "text-green-500"}`}
                    >
                        {statusMessage}
                    </p>
                )}
                <button onClick={sendReminder} disabled={isUploading} className="btn mt-4 btn-soft btn-accent">Set Reminder!</button>
            </div>

        </div>

    );
};

export default PrescriptionUploader;
