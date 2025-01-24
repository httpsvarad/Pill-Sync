import React, { useState } from "react";
import axios from "axios";
import useStore from "../store/useStore"; 

const PrescriptionUploader = () => {
  const [image, setImage] = useState(null); 
  const [statusMessage, setStatusMessage] = useState(""); 
  const [isUploading, setIsUploading] = useState(false); 

  const { user } = useStore(); 
  const userId = user?._id; 

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
    } catch (error) {
      console.error("Error uploading prescription:", error);
      setStatusMessage("An error occurred while uploading the prescription. Please try again.");
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Upload Prescription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Prescription Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {statusMessage && (
          <p
            className={`mt-4 text-sm text-center ${
              isUploading ? "text-gray-600" : "text-red-500"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUploader;
