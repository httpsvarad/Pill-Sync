import express from 'express';
import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "../cloudinary/cloudinary.config.js"
import { GoogleGenerativeAI } from "@google/generative-ai";


const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            throw new Error('All fields are required');
        }
        const userAlreadyExist = await userModel.findOne({ email });
        if (userAlreadyExist) {
            throw new Error('User already exist, Try to login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            email,
            password: hashedPassword,
            name,

        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {

        console.log(error);
        res.status(400).json({ success: false, message: "Error, Try Again!" });

    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        res.status(200).json({
            success: true, message: "Logged-In Successfully", user: {
                ...user._doc,
                password: undefined,
            },
        });


    } catch (error) {

        console.log(error);
        res.status(400).json({ success: false, message: "Error, Try Again!" });
    }
});

// router.post('/upload', async (req, res) => {
//     try {
//         const { userId, image } = req.body;

//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User ID is required.",
//             });
//         }

//         if (!image || !image.startsWith("data:image")) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid image format or no image provided.",
//             });
//         }


//         let uploadedImageUrl;
//         try {
//             const uploadResponse = await cloudinary.uploader.upload(image, {
//                 folder: "prescriptions",
//             });
//             uploadedImageUrl = uploadResponse.secure_url;
//         } catch (uploadError) {
//             console.error("Error uploading to Cloudinary:", uploadError);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to upload image to Cloudinary.",
//             });
//         }


//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId,
//             {
//                 $push: {
//                     prescriptions: {
//                         photoUrl: uploadedImageUrl,
//                     },
//                 },
//             },
//             { new: true }
//         );


//         let aiResponseText;
//         try {
//             const prompt = "Please extract the medicine names, dosages, schedules (morning, afternoon, or night), and durations from the provided prescription. Present the data in a strict JSON format with the following fields: name, dosage, schedule (morning, afternoon, or evening), and duration. The dosage schedule is represented as follows: 1-0-1 indicates one dose in the morning and one at night, 1-0-0 means one dose in the morning and one at night, 0-0-1 signifies one dose at night only, and 1-1-1 means one dose in the morning, afternoon, and night.Give data in restAPI response format";

//             const imagePart = {
//                 inlineData: {
//                     data: image.split(",")[1],
//                     mimeType: "image/png",
//                 },
//             };
//             const result = await model.generateContent([prompt, imagePart]);
//             aiResponseText = result.response.text();
//             console.log(aiResponseText);
//         } catch (aiError) {
//             console.error("Error processing image with Gemini API:", aiError);
//             return res.status(500).json({ success: false, message: "Failed to process image with AI." });
//         }

//         if (!updatedUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found.",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Prescription uploaded successfully.",
//             user: updatedUser,
//             aiResponseText,
//         });
//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error. Please try again.",
//         });
//     }
// });

router.post('/upload', async (req, res) => {
    try {
        const { userId, image } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        if (!image || !image.startsWith("data:image")) {
            return res.status(400).json({
                success: false,
                message: "Invalid image format or no image provided.",
            });
        }

        // Upload image to Cloudinary
        let uploadedImageUrl;
        try {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "prescriptions",
            });
            uploadedImageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
            console.error("Error uploading to Cloudinary:", uploadError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary.",
            });
        }

        // Extract medication data using the Gemini API
        let medications;
        try {
            const prompt = "Please extract the medicine names, dosages, schedules (morning, afternoon, or night), and durations from the provided prescription. Present the data in strict JSON format with the following fields: name, dosage, schedule (morning, afternoon, or evening), and duration. DONT USE BACKTICKS FOR JSON BLOCK INDICATORS";

            const imagePart = {
                inlineData: {
                    data: image.split(",")[1],
                    mimeType: "image/png",
                },
            };
            const result = await model.generateContent([prompt, imagePart]);
            const aiResponse = result.response.text();
            medications = JSON.parse(aiResponse).medications;
        } catch (aiError) {
            console.error("Error processing image with Gemini API:", aiError);
            return res.status(500).json({ success: false, message: "Failed to process image with AI." });
        }

        // Update user's prescription data
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    prescriptions: {
                        photoUrl: uploadedImageUrl,
                        medications,
                    },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Prescription uploaded successfully.",
            user: updatedUser,
            aiResponseText: medications,
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
});






// router.post("/send-reminder", async (req, res) => {
//     const accountSid = "AC7f09fe2349812bdd54c0813cf2bc9fe1";
//     const authToken = "f9186f37f58be74f5b6154066d91e4a6";
//     const client = twilio(accountSid, authToken);

//     const { name, medications } = req.body;

//     if (!name || !medications || !Array.isArray(medications)) {
//         return res.status(400).json({ message: "Invalid request body." });
//     }

//     try {
//         // Iterate through the medications and send a reminder
//         for (const medication of medications) {
//             const { name: medName, dosage, schedule } = medication;

//             if (!medName || !schedule) {
//                 console.log(`Skipping invalid medication: ${JSON.stringify(medication)}`);
//                 continue;
//             }

//             const message = `Hi ${name}, it's time to take your medication: ${medName} (${dosage || "as prescribed"}). Scheduled: ${schedule}.`;

//             // Send SMS using Twilio
//             await client.messages.create({
//                 from: "+12185357872", 
//                 to: "+918369636845", 
//                 body: message,
//             });

//             console.log(`Reminder sent for ${medName}`);
//         }

//         res.status(200).json({ message: "Reminders sent successfully." });
//     } catch (error) {
//         console.error("Error sending reminders:", error);
//         res.status(500).json({ message: "Failed to send reminders." });
//     }
// });







export default router;


