import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL =  import.meta.env.MODE==="development" ? "http://localhost:5001" : "/" ;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {  
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const Socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    Socket.connect();

    set({ socket: Socket });

    Socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js"; // Pre-configured axios client
// import toast from "react-hot-toast";
// import {connect ,io} from "socket.io-client";

// const BASE_URL = "http://localhost:5001"

// export const useAuthStore = create((set,get) => ({
//   authUser: null, // State: authenticated user data or null
//   isSigningUp: false, // State: flag for sign-up process
//   isLoggingIng: false, // State: flag for login process
//   isUpdatingProfile: false, // State: flag for profile update
//   isCheckingAuth: true, // State: loading state during authentication check
//   onlineUsers:[], //completed later using socket.io
//   socket:null,

//   checkAuth: async () => {
//     // Function to check and persist user authentication status by calling the backend API.
//     try {  
//       const res = await axiosInstance.get("/auth/check"); // Make API call to check authentication
//       set({ authUser: res.data }); // Update state with user data from the response
//      get().connectSocket(); //each time when you app refresh then this will run so connect socket each time

//     } catch (error) {
//       console.log("Error in checkAuth:", error); // Log error
//       set({ authUser: null }); // Clear user data on error
//     } finally {
//       set({ isCheckingAuth: false }); // Set loading state to false after check
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });
//       toast.success("Account created successsfully");

//       get().connectSocket();

//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.log("Error in signup in authStore ", error.message);
//       return res.status(500).json({ message: "Internal Server Error" });
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },
//   logout: async () => {
//     try {
//       const res = await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged Out Successfully");

//       get().disconnectSocket(); //when we logout from our app then we have to disconnect user from socket

//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.log("Error in logout in useAuthStore ", error.message);
//     }
//   },
//   login: async (data) => {

//     //whenever some one login that we must send online uers to soket so that everybody knows that he is online

//     set({ isLoggingIng: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged In successfully");

//       //socket connection on login 
//       get().connectSocket();  //get() used to access states and fn in any specific fn

//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.log("Error in login useAuthStore ", error.message);
//     } finally {
//       set({ isLoggingIng: false });
//     }
//   },

//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//        const res = await axiosInstance.put('/auth/update-profile',data);
//        console.log("Response data in UpdateProfile:",res.data)
//        set({authUser:res.data.updatedUser});

//        toast.success("Profile updated successfully")
//     } catch (error) {
//       console.log("Error in updateProfile in useAuthStore ", error.message);
//       toast.error("Internal Server Error");
//     }finally{
//         set({isUpdatingProfile:false}) 
//     }
//   },
//   connectSocket:()=>{
//     const {authUser} = get()
//     //if user not authenticated or if already connected to socket then return (no need of connection)
//     if(!authUser || get().socket?.connected) return 

//      const socket = io(BASE_URL,{
//       query:{
//         userId:authUser._id
//             }
//    });
//      socket.connect();
//     set({socket:socket})  //setting socket state with socket var we have 
     
//     //listen to the event getOnlineUsers as soon as we login  and update the onlineUsers array 
//     socket.on("getOnlineUsers",(userIds)=>{
//       set({onlineUsers:userIds})
//     })
//   },

//   disconnectSocket:()=>{
//     if(get().socket?.connected) get().socket.disconnect();
//   },

// }));
