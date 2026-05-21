import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import { Link } from "react-router-dom";
import { LogOut, MessageSquare } from "lucide-react";
// import ThemeToggle from "./ThemeToggle";
import Avatar from "../assets/default-avatar.png";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { mobileView } = useChatStore();

  return (
    <header className={`bg-base-200 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 mb-26 ${mobileView == 'chat' && 'hidden lg:block'}`}>
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ConnecTable</h1>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* <ThemeToggle /> */}
            {authUser && (
              <>
                <Link to={"/profile"} className={`flex items-center justify-between hover:bg-slate-800/50 py-2 px-3 rounded-lg`} >

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary"
                        style={{
                          backgroundImage: `url("${authUser?.profilePicture || Avatar}")`,
                        }}
                      ></div>
                      <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-sidebar-dark"></div>
                    </div>
                    <div className="hidden md:flex flex-col">
                      <h2 className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
                        {authUser?.fullName || "User"}
                      </h2>
                      <p className="text-slate-400 text-xs font-normal">Available</p>
                    </div>
                  </div>

                </Link>

                <button onClick={logout} className={`flex gap-2 items-center`}>
                  <LogOut className="size-5 text-red-600" />
                  <span className="hidden sm:inline text-red-600">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;