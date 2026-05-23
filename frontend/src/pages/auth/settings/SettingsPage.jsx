import { useThemeStore } from "../../../store/useThemeStore.js";

import { requestNotificationPermission } from "../../../lib/notifications.js";

import { toast } from "react-hot-toast";

import SettingsPageView from "./SettingsPageView.jsx";

const SettingsPage = () => {
	const {
		notificationsEnabled,
		setNotificationsEnabled,
	} = useThemeStore();


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
		<SettingsPageView handleNotificationToggle={handleNotificationToggle} />
	);
};

export default SettingsPage;