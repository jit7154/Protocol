//Store the selected theme of user in local storage so that you can show even on refreshing
import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("chat-theme") ||"forest",
    setTheme:(theme) =>{
        localStorage.setItem("chat-theme",theme);
        set({theme})
    },
}));

