import express from 'express';
import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "../cloudinary/cloudinary.config.js"


const router = express.Router();

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

        res.status(200).json({ success: true, message: "Logged-In Successfully" });


    } catch (error) {

        console.log(error);
        res.status(400).json({ success: false, message: "Error, Try Again!" });
    }
});


router.post('/upload', async (req, res) => {
  try {
    const { image, ...otherData } = req.body; 

    let updatedData = { ...otherData };

    if (image) {
      
      if (image.startsWith("data:image")) {
        try {
          
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "prescriptions",
          });

          
          updatedData.image = uploadResponse.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);

          return res.status(400).json({
            success: false,
            message: "Error uploading image to Cloudinary.",
          });
        }
      }
    }

    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Server error, please try again.",
    });
  }
});

export default router;