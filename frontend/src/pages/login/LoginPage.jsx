import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

import toast from "react-hot-toast";
import LoginPageView from "./LoginPageView";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);

	const { login, isLoggingIn } = useAuthStore();

	const navigate = useNavigate();

	const validateForm = () => {
		if (!formData.email.trim()) return toast.error("Email is required");
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format");
		if (!formData.password) return toast.error("Password is required");
		if (formData.password.length < 6)
			return toast.error("Password must contain atleast 6 characters");

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const success = validateForm();

		if (success === true) {
			const result = await login(formData);
			if (result?.success) {
				navigate("/chat");
			}
		}
	};

	return (
		<LoginPageView {...{ formData, setFormData, showPassword, setShowPassword, handleSubmit, isLoggingIn }} />
	);
};

export default LoginPage;
