import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings } from "lucide-react";

import Avatar from "../assets/default-avatar.png";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { mobileView } = useChatStore();

  return (
    <header className={`bg-base-200 border-b border-base-300 sticky w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 mb-26 ${mobileView == 'chat' && 'hidden lg:block'}`}>
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-base-content">ConnecTable</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {authUser && (
              <Link
                to={"/profile"}
                aria-label={authUser?.fullName ? `Open profile for ${authUser.fullName}` : "Open profile"}
                className={`flex items-center justify-between hover:bg-base-content/20 py-2 px-3 rounded-full tooltip tooltip-bottom`}
                data-tip={authUser?.fullName}
              >
                <div className="flex items-center gap-3 ">
                  <div className="relative">
                    <img
                      className="bg-center bg-no-repeat aspect-square object-cover rounded-full size-10 border-2 border-primary"
                      src={authUser?.profilePicture || Avatar}
                    />
                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
                  </div>
                  <div className="hidden md:flex flex-col">
                    <h2 className="text-sm font-semibold leading-tight text-base-content">
                      {authUser?.fullName || "User"}
                    </h2>
                    <p className="text-base-content/60 text-xs font-normal">Available</p>
                  </div>
                </div>

              </Link>
            )}

            <Link to={"/settings"} aria-label="Open settings" className="hover:bg-base-content/20 p-3 rounded-full">
              <Settings className="size-6" />
            </Link>
            {authUser && (
              <button onClick={logout} aria-label="Log out" className={`flex gap-2 items-center hover:bg-base-content/20 p-3 rounded-full`}>

                <LogOut className="size-5 text-red-600" />
                <span className="hidden sm:inline text-red-600">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;