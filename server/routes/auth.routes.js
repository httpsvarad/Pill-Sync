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


        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    prescriptions: {
                        photoUrl: uploadedImageUrl,
                    },
                },
            },
            { new: true }
        );


        let aiResponseText;
        try {
            const prompt = "Extract the medicines and details mentioned in this prescription.";
            const imagePart = {
                inlineData: {
                    data: image.split(",")[1], 
                    mimeType: "image/png",   
                },
            };
            const result = await model.generateContent([prompt, imagePart]);
            aiResponseText = result.response.text(); 
            console.log("AI",aiResponseText);
        } catch (aiError) {
            console.error("Error processing image with Gemini API:", aiError);
            return res.status(500).json({ success: false, message: "Failed to process image with AI." });
        }

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
            aiResponseText,
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
});



export default router;


