//This page will show all your chats and users to interact with
import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from "../components/Sidebar.jsx"
import NoChatComponent from "../components/NoChatComponent.jsx"
import ChatContainerComponent from "../components/ChatContainerComponent.jsx"

const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (
    <div className="h-screen bg-base-200">
    <div className="flex items-center justify-center pt-20 px-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
        
        <Sidebar/>

        {/*If a user is selected by user then you will show chats with that user else no chat container will be shown*/}
        {!selectedUser ? <NoChatComponent/> : <ChatContainerComponent/>}
        </div>
        </div>
      </div>
    </div>
  
  )
}

export default HomePage
