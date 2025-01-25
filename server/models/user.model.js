import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    prescriptions: [
        {
            photoUrl: { type: String, required: true }, 
            uploadedAt: { type: Date, default: Date.now },
            medications: [
                {
                    name: { type: String, required: true },
                    dosage: { type: String },
                    schedule: { type: String, required: true },
                    duration: { type: String, required: true },
                },
            ],
        },
    ],
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;
