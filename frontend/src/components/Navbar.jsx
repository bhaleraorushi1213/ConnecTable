import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useChatStore } from "../store/useChatStore";

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

          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`} >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button onClick={logout} className={`flex gap-2 items-center`}>
                  <LogOut className="size-5 text-red-600"/>
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