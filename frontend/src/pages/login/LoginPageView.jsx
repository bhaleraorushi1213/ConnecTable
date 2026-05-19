import {
  Loader2,
  Lock,
  LucideEye,
  LucideEyeOff,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

const LoginPageView = (props) => {
  const {
    formData, 
    setFormData, 
    showPassword, 
    setShowPassword, 
    handleSubmit, 
    isLoggingIn

  } = props;
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg-dark relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(123,60,231,0.15)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-40"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-900/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md z-10 bg-[#1e1e23]/75 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative flex items-center justify-center size-20 bg-gradient-to-br from-primary to-[#5b2cb3] rounded-2xl text-white shadow-lg shadow-primary/30 mb-5">
            <MessageSquare className="size-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            ConnecTable
          </h1>
          <p className="text-[#a79db8] text-sm">Welcome back!</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="email" className="block text-xs font-medium text-[#a79db8] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <div className="pl-4 text-[#a79db8]">
                <Mail className="size-5" />
              </div>
              <input
                id="email"
                className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label htmlFor="password" className="text-xs font-medium text-[#a79db8]">
                Password
              </label>
            </div>
            <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <div className="pl-4 text-[#a79db8]">
                <Lock className="size-5" />
              </div>
              <input
                id="password"
                className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="pr-4 text-[#a79db8] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoggingIn}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? (
                    <LucideEye className="size-5" />
                  ) : (
                    <LucideEyeOff className="size-5" />
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/reset-password"
              className="text-sm font-semibold text-primary hover:text-[#9d6bf3] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              className="relative w-full overflow-hidden rounded-xl bg-primary h-12 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_-5px_rgba(123,60,231,0.5)] hover:bg-[#6a32c9] active:scale-[0.98] transition-all duration-200 group"
              type="submit"
            >
              <span className="relative z-10">
                {isLoggingIn ? (
                  <Loader2 className="w-full h-5 animate-spin text-center" />
                ) : (
                  "Log In"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#a79db8] text-sm mt-6">
            Don't have an account?
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-[#9d6df0] transition-colors ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPageView