import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
const BASE_URL = "http://localhost:5000/api/auth";
const useStore = create((set) => ({

    user: null,
    message: null,
    loading: false,

    signup: async (email, password, name) => {
        set({ loading: true, message: null });
        try {
            const response = await axios.post(`${BASE_URL}/signup`, { email, password, name });
            set({ user: response.data, loading: false });

        } catch (error) {
            set({ message: "Registration failed. Please try again.", loading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ loading: true, message: null });
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            set({ user: response.data.user, loading: false });

        } catch (error) {
            set({ message: "Invalid Credentials", loading: false });
            throw error;
        }
    },


    // sendSMS: async (name, medications) => {
    //     set({ loading: true, message: null });
    //     try {
    //         const response = await axios.post(`${BASE_URL}/send-reminder`, { name, medications });
    //         set({ message: response.data.message, loading: false });

    //     } catch (error) {
    //         set({ message: "Failed to send SMS", loading: false });
    //         throw error;
    //     }
    // }



}))

export default useStore;