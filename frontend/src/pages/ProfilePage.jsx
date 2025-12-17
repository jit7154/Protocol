import { useState,React } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera,Mail,User } from "lucide-react"
const ProfilePage = () => {
    const {authUser,isUpdatingProfile,updateProfile} = useAuthStore()
    const [selectedImg, setSelectedImg] = useState(null)
    console.log("AuthUser State:", authUser); // Add this line

    const handleImageUpload = async (e)=>{
        //fn to handle image upload during update profile
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image); //new uploaded image by user is set to selectedImg(state which is used to display it in profile page)
            await updateProfile({profilePic:base64Image}); //this will upload the updated profile pic in cloudinary 
        } //NOTE::: here name(profilePic) should be same as of what we are expecting in backend update-profile fn ////

        {/*const reader = new FileReader();

Where it comes from: FileReader is a built-in JavaScript object that allows web applications to asynchronously read the contents of files stored on the user's computer.
What it's doing: It creates a new FileReader object.
Use: The FileReader is used to read the contents of the uploaded image file.
reader.readAsDataURL(file);

Where it comes from: reader is the FileReader object created in the previous line, and readAsDataURL is a method of the FileReader object.
What it's doing: It starts reading the contents of the file as a data URL (a base64-encoded string representing the file's data).
Use: This line initiates the process of converting the image file into a base64-encoded string, which can then be used to display the image or send it to a server.
reader.onload = async () => {

Where it comes from: reader is the FileReader object, and onload is an event handler that is called when the file reading operation is complete.
What it's doing: It defines an asynchronous function that will be executed when the FileReader finishes reading the file.
Use: This sets up a callback function to be executed once the file is fully read.
const base64Image = reader.result;

Where it comes from: reader is the FileReader object, and result is a property that contains the result of the file reading operation (the base64-encoded string).
What it's doing: It extracts the base64-encoded image data from the reader.result property.
Use: This line retrieves the base64-encoded image data, which can then be used to display the image or send it to a server.*/}

    }
  
    return (
        <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>
  
            {/* avatar upload section */}
  
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={ selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/*User Info setion*/}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
              </div>
  
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
              </div>
            </div>
  
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
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
  )
}

export default ProfilePage
