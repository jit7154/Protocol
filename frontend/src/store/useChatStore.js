import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.filteredUsers });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
// import {create } from "zustand"
// import toast from "react-hot-toast"
// import {axiosInstance} from "../lib/axios.js"

// import { useAuthStore } from "./useAuthStore.js"
// import { useEffect } from "react"

// export const useChatStore = create((set,get)=>({
//    messages:[], //state for storing messages
//    users:[],    //state for storing users
//    selectedUser:null,   
//    isUsersLoading:false,   
//    isMessagesLoading:false,

//    getUsers:async ()=>{
//     set({isUsersLoading:true})
//     try {
//         const res = await axiosInstance.get("/messages/users");
//         set({users: res.data.filteredUsers }) //its very important that you correctly fetches data from response u get from axios api call 
//         //TIP: check for res object structure in backend for facing no issue further 
//         toast.success("Users loaded successfully");
//     } catch (error) {
//         toast.error("Users can't be loaded");
//         console.log("Error in getUsers in useChatStore ",error.response.data.message)
//     }finally{
//         set({isUsersLoading:false})
//     }
//    },
   
//    getMessages:async (userId)=>{
//       set({isMessagesLoading:true})
//       try {
//         const res=await axiosInstance.get(`/messages/${userId}`);
//         set({messages:res.data})
//         toast.success("Messages fetched successfully")
//       } catch (error) {
//         toast.error("Messages cant be loaded");
//         console.log("Error in getMessages in useChatStore ",error.response.data.message)
//       }finally{
//         set({isMessagesLoading:false})
//       }
//    },

//    sendMessage:async(messagedata)=>{
//         const {selectedUser,messages} = get(); //When you need to access the current state within an action (like your setMessage function) in a Zustand store, you typically use the get() function provided by Zustand.
//         //get() always returns the most recent state
//      try {
//         const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messagedata);
//         set({messages:[...messages,res.data]})
//         toast.success("Message sent successfully")
//      } catch (error) {
//         toast.error("Error in setMessages in useChatStore ",error.response.data.message)
//      }
//    },


//    subscribeToMessages: () => {
//       const {selectedUser} = get()
//       if(!selectedUser) return

//       const socket = useAuthStore.getState().socket;

//       //todo:optimize this one later   
//       socket.on("newMessage",(newMessage)=>{
//          //debug step
//          console.log("New message received (client):", newMessage);

//       set({messages:[...get().messages,newMessage]}) //keeping all prev messages in history -> ading new one also
//       console.log("Messages state updated:", get().messages);
//       })
//     },

//    // subscribeToMessages: () => {
//    //    const socket = useAuthStore.getState().socket;

//    //    socket.on("newMessage", (newMessage) => {
//    //        console.log("useChatStore: newMessage event received:", newMessage); // Check if event is triggered and data is correct

//    //        set({ messages: [...get().messages, newMessage] });

//    //        console.log("useChatStore: messages state after update:", get().messages); // Check updated messages state
//    //    });
//    // },
//     unsubscribeFromMessages: () => {
      
//       const socket = useAuthStore.getState().socket;
      
//       socket.off("newMessage");

//     },
// //    subscribeToMessages: () => {
// //       const socket = useAuthStore.getState().socket;

// //       socket.on("newMessage", (newMessage) => {
// //           console.log("useChatStore: newMessage event received:", newMessage);
// //           set({ messages: [...get().messages, newMessage] });
// //           console.log("useChatStore: messages state after update:", get().messages);
// //       });
// //   },

// //   unsubscribeFromMessages: () => {
// //       const socket = useAuthStore.getState().socket;
// //       socket.off("newMessage");
// //   },


//   //todo:Optimise this later
//    setSelectedUser: (selectedUser) => set({selectedUser}),
   
   


// }))
