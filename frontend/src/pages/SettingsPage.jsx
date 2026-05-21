// src/pages/SettingsPage.jsx
import { useThemeStore } from "../store/useThemeStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { requestNotificationPermission } from "../lib/notifications.js";

import { ArrowLeft, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "react-hot-toast";

import Avatar from "../assets/default-avatar.png";
import { Link } from "react-router-dom";

const THEMES = [
	"light", "dark", "cupcake", "forest",
	"aqua", "synthwave", "cyberpunk", "dracula"
];

const SettingsPage = () => {
	const {
		theme,
		setTheme,
		soundEnabled,
		setSoundEnabled,
		notificationsEnabled,
		setNotificationsEnabled,
		messageVolume,
		setMessageVolume,
	} = useThemeStore();

	const { authUser } = useAuthStore();

	const handleNotificationToggle = async () => {
		if (!notificationsEnabled) {
			const granted = await requestNotificationPermission();
			if (!granted) {
				toast.error("Please allow notifications in your browser settings");
				return;
			}
		}
		setNotificationsEnabled(!notificationsEnabled);
	};

	return (
		<div className="h-full bg-base-100 p-6 max-w-2xl mx-auto mt-16">
			<div className="flex gap-x-6 items-center mb-8">
				<Link to="/" className="hover:bg-base-300 p-3 rounded-full">
					<ArrowLeft className="size-6" />
				</Link>
				<div className="text-2xl font-bold text-white ">Settings</div>
			</div>

			{/* theme section */}
			<section className="mb-8">
				<h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
					Appearance
				</h2>
				<div className="grid grid-cols-4 gap-2">
					{THEMES.map((t) => (
						<button
							key={t}
							onClick={() => setTheme(t)}
							data-theme={t}
							className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                ${theme === t
									? "border-primary"
									: "border-transparent hover:border-slate-600"
								}`}
						>
							<div className="grid grid-cols-2 gap-0.5 w-8">
								<div className="h-3 rounded-sm bg-primary" />
								<div className="h-3 rounded-sm bg-secondary" />
								<div className="h-3 rounded-sm bg-accent" />
								<div className="h-3 rounded-sm bg-neutral" />
							</div>
							<span className="text-xs text-white capitalize truncate w-full text-center">
								{t}
							</span>
						</button>
					))}
				</div>
			</section>

			{/* sound section */}
			<section className="mb-8">
				<h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
					Sound
				</h2>
				<div className="flex flex-col gap-4 bg-base-200 rounded-xl p-4">

					{/* sound toggle */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{soundEnabled
								? <Volume2 className="size-5 text-primary" />
								: <VolumeX className="size-5 text-slate-400" />
							}
							<div>
								<p className="text-sm font-medium text-white">
									Message Sounds
								</p>
								<p className="text-xs text-slate-400">
									Play sounds for new messages
								</p>
							</div>
						</div>
						<input
							type="checkbox"
							className="toggle toggle-primary"
							checked={soundEnabled}
							onChange={() => setSoundEnabled(!soundEnabled)}
						/>
					</div>

					{/* volume slider */}
					{soundEnabled && (
						<div className="flex items-center gap-3">
							<VolumeX className="size-4 text-slate-400" />
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={messageVolume}
								onChange={(e) => setMessageVolume(Number(e.target.value))}
								className="range range-primary range-sm flex-1"
							/>
							<Volume2 className="size-4 text-slate-400" />
						</div>
					)}
				</div>
			</section>

			{/* notifications section */}
			<section className="mb-8">
				<h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
					Notifications
				</h2>
				<div className="bg-base-200 rounded-xl p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{notificationsEnabled
								? <Bell className="size-5 text-primary" />
								: <BellOff className="size-5 text-slate-400" />
							}
							<div>
								<p className="text-sm font-medium text-white">
									Push Notifications
								</p>
								<p className="text-xs text-slate-400">
									Show notifications when app is in background
								</p>
							</div>
						</div>
						<input
							type="checkbox"
							className="toggle toggle-primary"
							checked={notificationsEnabled}
							onChange={handleNotificationToggle}
						/>
					</div>
				</div>
			</section>

			{/* profile preview */}
			<section className="pb-8">
				<h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
					Profile Preview
				</h2>
				<div className="bg-base-200 rounded-xl p-4 flex items-center gap-4">
					<img
						src={authUser?.profilePicture || Avatar}
						className="size-14 rounded-full object-cover border-2 border-primary"
					/>
					<div>
						<p className="text-white font-semibold">{authUser?.fullName}</p>
						<p className="text-slate-400 text-sm">@{authUser?.userName}</p>
						<p className="text-slate-500 text-xs">{authUser?.email}</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default SettingsPage;