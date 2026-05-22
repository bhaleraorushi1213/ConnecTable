import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/profilePage/ProfilePage.jsx";
import SignUpPage from "./pages/signup/SignUpPage";
import LoginPage from "./pages/login/LoginPage";
import Navbar from "./components/Navbar";

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
