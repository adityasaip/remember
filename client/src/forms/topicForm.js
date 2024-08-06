import axios from "axios"
import { useReducer, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import { useTopicsContext } from "../hooks/useTopicsContext";

const initialTopicState = {
    topicName: "",
    subTopics: [{ subTopicName: "" }]
  };

function reducer(topic, action) {
    switch (action.type) {
        case 'topic-name':
            console.log(action.payload.topicName)
            return {
                ...topic,
                topicName : action.payload.topicName
            }
        case 'sub-topic-name':
            const updatedSubTopics = topic.subTopics.map((subTopic, index) => action.payload.index === index ? {subTopicName: action.payload.subTopicName} : subTopic)
            return {
                ...topic,
                subTopics: updatedSubTopics
            }
        case 'add-sub-topic':
            return {
                ...topic,
                subTopics: [
                    ...topic.subTopics,
                    {subTopicName: ''}
                ]
            }
        case 'delete-sub-topic':
            if (topic.subTopics.length > 1) {
                console.log("In here", action.payload.index)
                const updatedSubTopics = topic.subTopics.filter((_, index) => index !== action.payload.index)
                return {
                    ...topic,
                    subTopics: updatedSubTopics
                }
            }
            return topic
        case 'RESET_FORM':
            return initialTopicState
        default:
            return topic
    }
}


const TopicForm = () => {
    const [topic, topicDispatch] = 
    useReducer(reducer, initialTopicState)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {user} = useAuthContext()
    const { dispatch } = useTopicsContext()

    const handleTopicNameChange = (topicName) => {
        topicDispatch({type: 'topic-name', payload: {topicName}})
    }
    const handleSubTopicChange = (index, subTopicName) => {
        topicDispatch({type: 'sub-topic-name', payload: {index, subTopicName}})
    }
    const handleAddSubTopic = () => {
        topicDispatch({type: 'add-sub-topic'})
    }
    const handleDeleteSubTopic = (index) => {
        topicDispatch({type: 'delete-sub-topic', payload: {index}})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            // setError('You need to login')
            alert('You must be logged in')
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            const response = await axios({
                method: 'post',
                url: '/api/topics', 
                data: topic,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                  }
            })

            if (response.status === 201) {
              alert('Form submitted successfully');
              topicDispatch({ type: 'RESET_FORM' }); // Reset form after successful submission
              dispatch({type: 'CREATE_TOPIC', payload: response.data})
            } else {
              alert('Failed to submit form');
            }
          } catch (error) {
            alert('Error submitting form: ' + error.message);
        }
          setIsLoading(false)
    }
        


    return (
        <div className=" flex justify-center items-center">
            <div className="topicform w-56 shadow-md p-3 pb-5 h-fit">
                <h4 className="font-bold">Add new topic</h4>
                <form onSubmit={handleSubmit}>
                    <label name="topicName" htmlFor="id_topic_name">Topic Name</label>
                    <input className="block border-2 border-gray-500 rounded w-full" type='text' value={topic.topicName} onChange={(e) => handleTopicNameChange(e.target.value)}/>
                    
                    { topic.subTopics.map( (subTopic, index) => (
                        <div key={index}>
                            <label htmlFor={index} name={`subTopic_${index}`}>SubTopic {index+1}:</label>
                            <input className="block border-2 border-gray-500 rounded shadow w-full" type="text" id={index} value={subTopic.subTopicName} onChange={(e) => handleSubTopicChange(index, e.target.value)} />
                            <button type="button" className="mt-2 block bg-slate-500 text-white shadow-md rounded-md w-40" onClick={() => handleDeleteSubTopic(index)}>Delete</button>
                        </div>
                    ) ) }
                    <button type="button" className="mt-2 block bg-yellow-600 text-white shadow-md rounded-md w-40" onClick={handleAddSubTopic}>Add</button>

                    <button className="mt-2 block bg-indigo-500 text-white shadow-md rounded-md w-full h-8" type="submit" disabled={isLoading}>
                    {/* <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> */}
                    Submit
                    </button>
                    {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
                </form>
            </div>
        </div>
    )
}

export default TopicForm