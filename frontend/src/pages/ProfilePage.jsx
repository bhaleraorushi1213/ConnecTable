import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Camera, Mail, Pencil, Trash2, User, UserCircle } from "lucide-react";
import Avatar from "../assets/default-avatar.png";
import { Link } from "react-router-dom";

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
	const [selectedImg, setSelectedImg] = useState();

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			await updateProfile({ profilePicture: base64Image });
		}
	};

	return (
		<div className="h-screen pt-16">
			<div className="max-w-2xl mx-auto p-4 py-4">
				<div className="bg-base-300 rounded-xl p-6 space-y-8">
					<div className="text-center">
						<div className="flex items-start justify-between">
							<Link to={"/"} className="hover:bg-slate-800/50 p-2 rounded-full">
								<ArrowLeft className="w-6 h-6" />
							</Link>
							<div>
								<h1 className="text-2xl font-semibold">Profile</h1>
								<p className="text-gray-600 mb-2">Your profile information</p>

							</div>
							<button onClick={() => { }} className="text-red-700">
								<Trash2 className="w-6 h-6" />
							</button>
						</div>

						{/* avatar upload section */}

						<div className="flex flex-col items-center gap-2">
							<div className="relative">
								<img
									src={selectedImg || authUser.profilePicture || Avatar}
									alt="Profile"
									className="size-32 rounded-full object-cover border-2"
								/>
								<label
									htmlFor="avatar-upload"
									className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out ${isUpdatingProfile ? "animation-pulse pointer-events-none" : ""}`}
								>
									<Camera className="w-5 h-5 text-base-200" />
									<input
										type="file"
										id="avatar-upload"
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
										disabled={isUpdatingProfile}
									/>
								</label>
							</div>
							<p className="text-sm text-zinc-400">
								{isUpdatingProfile
									? "Uploading..."
									: "Click the camera icon to update your profile picture."}
							</p>
						</div>
					</div>

					<div className="space-y-6">
						<div className="flex gap-6 flex-col lg:flex-row">
							<div className="space-y-1.5 lg:flex-grow">
								<div className="text-sm text-zinc-400 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4" />
										<span>Name</span>
									</div>
									<button className="hover:text-slate-300 tooltip" data-tip="Edit">
										<Pencil className="size-4" />
									</button>

								</div>
								<input
									type="text"
									value={authUser?.fullName}
									className="px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-500 w-full"
									disabled
								/>

							</div>

							<div className="space-y-1.5 lg:flex-grow">
								<div className="text-sm text-zinc-400 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<UserCircle className="w-4 h-4" />
										<span>Username</span>
									</div>
									<button className="hover:text-slate-300 tooltip too" data-tip="Edit">
										<Pencil className="size-4" />
									</button>
								</div>
								<input
									type="text"
									value={authUser?.userName}
									className="px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-500 w-full"
									disabled
								/>

							</div>
						</div>

						<div className="space-y-1.5">
							<div className="text-sm text-zinc-400 flex justify-between items-center gap-2">
								<div className="flex items-center gap-2">
									<Mail className="w-4 h-4" />
									<span>Email</span>
								</div>
								<button className="hover:text-slate-300 tooltip" data-tip="Edit">
									<Pencil className="size-4" />
								</button>
							</div>
							<input
								type="email"
								value={authUser?.email}
								className="px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-500 block w-full"
								disabled
							/>
						</div>
					</div>

					<div className=" bg-base-300 rounded-xl p-2">
						<h2 className="text-lg font-medium mb-4">Account Information</h2>
						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between py-2 border-b border-zinc-700">
								<span>Member Since</span>
								<span>{authUser.createdAt?.split("T")[0]}</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span>Account Status</span>
								<span className="text-green-500">Active</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
