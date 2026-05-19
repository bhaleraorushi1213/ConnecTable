import {
  Loader2,
  Lock,
  LucideEye,
  LucideEyeOff,
  Mail,
  MessageSquare,
  User,
  UserCircle,
  UserLock,
} from "lucide-react";

import { Link } from "react-router-dom";

const SignUpPageView = (props) => {
  const {
    formData,
    setFormData,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    isSigningUp
  } = props;
  
  return (
    <div className="min-h-100 w-full flex items-center justify-center bg-bg-dark py-16 my-8 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(123,60,231,0.15)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-40"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-900/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-xl z-10 bg-[#1e1e23]/75 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-2 text-center">
          <div className="relative flex items-center justify-center size-20 bg-gradient-to-br from-primary to-[#5b2cb3] rounded-2xl text-white shadow-lg shadow-primary/30 mb-2">
            <MessageSquare className="size-10 font-bold" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Join ConnecTable
          </h1>
          <p className="text-[#a79db8] text-sm">
            Enter your details to sign up
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div className="group">
            <label className="block text-xs font-medium text-[#a79db8] mb-1.5 ml-1">
              Full Name
            </label>
            <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <div className="pl-4 text-[#a79db8]">
                <User className="size-5" />
              </div>
              <input
                className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                placeholder="e.g. Alex Carter"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="sm:flex-row lg:flex max-w-full gap-2 justify-between ">
            {/* Username Field */}
            <div className="group flex-grow">
              <label className="block text-xs font-medium text-[#a79db8] mb-1.5 ml-1">
                Username
              </label>
              <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                <div className="pl-4 text-[#a79db8]">
                  <UserCircle className="size-5" />
                </div>
                <input
                  className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                  placeholder="e.g. alex123"
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="group flex-grow">
              <label className="block text-xs font-medium text-[#a79db8] mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                <div className="pl-4 text-[#a79db8]">
                  <Mail className="size-5" />
                </div>
                <input
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
          </div>

          <div className="sm:flex-row lg:flex max-w-full gap-2 justify-between ">
            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-xs font-medium text-[#a79db8]">
                  Password
                </label>
              </div>
              <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                <div className="pl-4 text-[#a79db8]">
                  <Lock className="size-5" />
                </div>
                <input
                  className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="pr-4 text-[#a79db8] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <LucideEye className="size-5" />
                  ) : (
                    <LucideEyeOff className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-xs font-medium text-[#a79db8]">
                  Confirm Password
                </label>
              </div>
              <div className="relative flex items-center w-full rounded-xl bg-[#19191D] border border-white/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                <div className="pl-4 text-[#a79db8]">
                  <UserLock className="size-5" />
                </div>
                <input
                  className="w-full bg-transparent border-none text-white placeholder:text-[#5c546b] focus:ring-0 focus:outline-none h-12 px-3 text-sm font-medium"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  value={formData.confirmPassword}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="pr-4 text-[#a79db8] hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <LucideEye className="size-5" />
                  ) : (
                    <LucideEyeOff className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="relative w-full overflow-hidden rounded-xl bg-primary h-12 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_-5px_rgba(123,60,231,0.5)] hover:bg-[#6a32c9] active:scale-[0.98] transition-all duration-200 group"
              type="submit"
              disabled={isSigningUp}
            >
              <span className="relative z-10">
                {isSigningUp ? (
                  <Loader2 className="w-full h-5 animate-spin text-center" />
                ) : (
                  "Create Account"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#a79db8] text-sm mt-6">
            Already have an account?            <Link
              to="/login"
              className="text-primary font-semibold hover:text-[#9d6df0] transition-colors ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPageView