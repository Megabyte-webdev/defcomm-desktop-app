import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import useAuth from "../hooks/useAuth";

const LoginForm = ({ version }) => {
    const { register, handleSubmit } = useForm();
    const { login, isLoading, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        await login(data);
    };

    return (
        <div
            id="login-form"
            className="w-full max-w-[800px] flex justify-center lg:justify-end items-center pt-20"
        >
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-oliveLight text-gray-300 p-8 rounded-2xl shadow-xl w-[350px] flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-4 text-center">Sign in With Defcomm account</h2>
                <div>
                    <input {...register("email")} type="text" placeholder="Email or Phone Number" className="w-full p-3 mb-4 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-md" required />
                </div>
                <div className="flex justify-between items-center text-sm text-[olive] font-medium">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register("rememberMe")} /> Remember me
                    </label>
                    <a href="#" className="">Forgot Password?</a>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error?.error}</p>}
                <button type="submit" className="mt-4 w-full bg-black text-white p-3 rounded-md flex justify-center items-center" disabled={isLoading}>
                    {isLoading ? <><FaSpinner className="animate-spin mr-2" /> Logging in...</> : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
