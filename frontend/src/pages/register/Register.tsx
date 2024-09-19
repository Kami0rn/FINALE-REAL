import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/register";
import backgroundImg from "../../assets/Register.jpg";
import "./Register.css";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        firstname: "",
        lastname: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        email: "",
        firstname: "",
        lastname: "",
    });
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let valid = true;
        const newErrors = {
            username: "",
            password: "",
            email: "",
            firstname: "",
            lastname: "",
        };

        if (!formData.firstname.trim()) {
            newErrors.firstname = "First name is required";
            valid = false;
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = "Last name is required";
            valid = false;
        }
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            valid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const response = await registerUser(formData);
            if (response && response.username) {
                setMessage("Registration successful!");
                console.log("Registered user:", response);
                navigate("/login");
            } else {
                setMessage("Registration failed. Please try again.");
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred");
            }
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundColor: "#333",
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <header className="w-full py-4 gradient-animation">
                    <h1 className="text-4xl font-bold text-center text-white" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>
                        <Link to="/" className="hover:underline">XenoAI</Link>
                    </h1>
                </header>
                <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <h2
                        className="text-3xl font-semibold mb-4"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(255, 100, 150, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        Register
                    </h2>
                    {message && (
                        <p
                            className="mb-4 text-center text-xl"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(200, 150, 255, 1), rgba(255, 200, 150, 1), rgba(150, 200, 255, 1))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {message}
                        </p>
                    )}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    First Name:
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Last Name:
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-2 mt-4 rounded-full text-black transition"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-4 text-white">
                        Already have an account?{" "}
                        <Link to="/login" className="text-pink-500 underline">
                            Login
                        </Link>
                    </p>
                </main>
                <footer className="w-full py-4 text-center text-white gradient-animation">
                    <p>&copy; 2023 XenoAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Register;
