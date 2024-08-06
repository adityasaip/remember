import { TopicsContext } from "../context/topicContext";
import { useContext } from "react";

// we can just invoke this function wherever we need TopicsContext values
export const useTopicsContext = () => {
    // grabbing the context value from TopicsContext
    const context = useContext(TopicsContext)

    if (!context){
        throw Error('useTopicsContext must be used inside TopicsContextProvider')
    }
    
    return context
}