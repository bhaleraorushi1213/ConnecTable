import { useState } from "react";

import { useAuthStore } from "../../../store/useAuthStore.js";

import toast from "react-hot-toast";
import SignUpPageView from "./SignUpPageView";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.fullName.trim()) return toast.error("Full name is required");
		if (!formData.userName.trim()) return toast.error("Username is required");
		if (!formData.email.trim()) return toast.error("Email is required");
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format");
		if (!formData.password) return toast.error("Password is required");
		if (formData.password.length < 6)
			return toast.error("Password must contain at least 6 characters");
		if (formData.confirmPassword !== formData.password)
			return toast.error("Confirm password must be same as Password ");

		return true;
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		const success = validateForm();

		if (success === true) signup(formData);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	return (
		<SignUpPageView
			{...{
				formData,
				setFormData,
				showPassword,
				showConfirmPassword,
				togglePasswordVisibility,
				toggleConfirmPasswordVisibility,
				handleSubmit,
				isSigningUp
			}} />
	);
};

export default SignUpPage;
