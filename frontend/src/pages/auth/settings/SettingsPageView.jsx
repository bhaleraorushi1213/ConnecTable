import { Link } from "react-router-dom";
import { useThemeStore } from "../../../store/useThemeStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

import { ArrowLeft, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { THEMES } from "../../../constants";
import Avatar from "../../../assets/default-avatar.png";

const SettingsPageView = ({ handleNotificationToggle }) => {
  const {
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    messageVolume,
    setMessageVolume,
  } = useThemeStore();

  const { authUser } = useAuthStore();

  return (
    <div className="py-4">

      <div className="h-full bg-base-300/60 p-6 max-w-2xl mx-auto mt-16 rounded-2xl">
        <div className="flex gap-x-6 items-center mb-8">
          <Link to={"/"} aria-label="Back to chats" className="hover:bg-base-300 p-3 rounded-full">
            <ArrowLeft className="size-6" />
          </Link>
          <div className="text-2xl font-bold text-base-content ">Settings</div>
        </div>

        {/* theme section */}
        <section className="mt-8">
          <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-4">
            Appearance
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                ${theme === t.id
                    ? "border-primary"
                    : "border-base-content/10 hover:border-base-content/30"
                  }`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-8 rounded overflow-hidden">
                  {t.preview.map((color, i) => (

                    <div
                      key={i}
                      className="h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-base-content capitalize">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* sound section */}
        <section className="mt-8">
          <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-4">
            Sound
          </h2>
          <div className="flex flex-col gap-4 bg-base-300 rounded-xl p-4">

            {/* sound toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled
                  ? <Volume2 className="size-5 text-primary" />
                  : <VolumeX className="size-5 text-base-content/60" />
                }
                <div>
                  <p className="text-sm font-medium text-base-content">
                    Message Sounds
                  </p>
                  <p className="text-xs text-base-content/60">
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
                <VolumeX className="size-4 text-base-content/60" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={messageVolume}
                  onChange={(e) => setMessageVolume(Number(e.target.value))}
                  className="range range-primary range-sm flex-1"
                />
                <Volume2 className="size-4 text-base-content/60" />
              </div>
            )}
          </div>
        </section>

        {/* notifications section */}
        <section className="mt-8">
          <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-4">
            Notifications
          </h2>
          <div className="bg-base-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled
                  ? <Bell className="size-5 text-primary" />
                  : <BellOff className="size-5 text-base-content/60" />
                }
                <div>
                  <p className="text-sm font-medium text-base-content">
                    Push Notifications
                  </p>
                  <p className="text-xs text-base-content/60">
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
        {authUser &&
          <section className="p-8">
            <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-4">
              Profile Preview
            </h2>
            <div className="bg-base-200 rounded-xl p-4 flex items-center gap-4">
              <img
                src={authUser?.profilePicture || Avatar}
                className="size-14 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <p className="text-base-content font-semibold">{authUser?.fullName}</p>
                <p className="text-base-content/60 text-sm">@{authUser?.userName}</p>
                <p className="text-base-content/40 text-xs">{authUser?.email}</p>
              </div>
            </div>
          </section>
        }
      </div>
    </div>
  )
}

export default SettingsPageView