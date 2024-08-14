import { createContext, useReducer } from "react";
//we are doing all these to keep the frontend data in sync with backend

// creates new context
export const TopicsContext = createContext()

// reducer function to handle dispatch operations
export const topicsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TOPICS':
            return {
                topics: action.payload
            }
        case 'CREATE_TOPIC':
            return {
                topics: [action.payload, ...state.topics]
            }
        case 'EDIT_TOPICNAME':
            return {  
                topics: state.topics.map((topic) => topic._id === action.payload.id ? {...topic, topicName : action.payload.topicName} : topic)
            }
        case 'DELETE_TOPIC':
            return {
                topics: state.topics.filter((topic) => topic._id !== action.payload.id)
            }
        case 'EDIT_SUB_DATA':
            const updateFields = {}
            if ('subTopicName' in action.payload){
                updateFields.subTopicName = action.payload.subTopicName
            }
            if ('description' in action.payload){
                updateFields.description = action.payload.description
            }
            const updatedTopics = state.topics.map((topic) => topic._id === action.payload.id ? 
                { ...topic, 
                subTopics: topic.subTopics.map((subTopic) => subTopic._id === action.payload.subId ? 
                {...subTopic, ...updateFields} : subTopic)} : topic)
            return {
                ...state,
                topics: updatedTopics
            }
        case 'DELETE_SUB':
            const filteredTopics = state.topics.map((topic) => topic._id === action.payload.id ? 
                { ...topic, 
                subTopics: topic.subTopics.filter((subTopic) => subTopic._id !== action.payload.subId)} : topic)
            return {
                ...state,
                topics: filteredTopics
            }
        case 'ADD_SUB':
            const newTopics = state.topics.map((topic) => topic._id === action.payload.id ? {...topic, subTopics: [...topic.subTopics, {...action.payload.subTopic, revisionCount: 0}]} : topic)
            return {
                ...state,
                topics: newTopics
                }
        default:
            return state
    }
}

// create a provider which has a state
export const TopicsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(topicsReducer, {topics: null}) 

    return (
        <TopicsContext.Provider value={{...state, dispatch}}>
            {children}
        </TopicsContext.Provider>
    )
}