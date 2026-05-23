import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import ProfilePage from "./pages/auth/profilePage/ProfilePage.jsx";
import SettingsPage from "./pages/auth/settings/SettingsPage.jsx";


const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth && !authUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader className="size-10 animate-spin" />
			</div>
		);
	}

	return (
		<>
			<div data-theme={theme} className="h-full">
				<Navbar />

				<Routes>
					<Route
						path="/"
						element={authUser ? <HomePage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/signup"
						element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
					/>
					<Route
						path="/login"
						element={!authUser ? <LoginPage /> : <Navigate to="/" />}
					/>
					<Route path="/settings" element={<SettingsPage />} />
					<Route
						path="/profile"
						element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
					/>

				</Routes>

				<Toaster />
			</div>
		</>
	);
};

export default App;
