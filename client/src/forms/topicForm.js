import axios from "axios"
import { useReducer, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import { useTopicsContext } from "../hooks/useTopicsContext";
import {ReactComponent as AddSub} from "../assets/add_box_27dp_434343_FILL0_wght400_GRAD0_opsz24.svg"
import {ReactComponent as DeleteSub} from "../assets/delete_27dp_BB271A_FILL0_wght400_GRAD0_opsz24.svg"

const initialTopicState = {
    topicName: "",
    subTopics: [{ subTopicName: "", description: "" }]
  };

function reducer(topic, action) {
    switch (action.type) {
        case 'topic-name':
            console.log(action.payload.topicName)
            return {
                ...topic,
                topicName : action.payload.topicName
            }
        case 'sub-topic-data':
            console.log(action.payload)
            const updateFields = {}
            if ('subTopicName' in action.payload) {
                updateFields.subTopicName = action.payload.subTopicName
            }
            if ('description' in action.payload) {
                updateFields.description = action.payload.description
            }
            const updatedSubTopics = topic.subTopics.map((subTopic, index) => action.payload.index === index ? {...subTopic, ...updateFields} : subTopic)
            console.log(updatedSubTopics)
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
    // const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {user} = useAuthContext()
    const { dispatch } = useTopicsContext()

    const handleTopicNameChange = (topicName) => {
        topicDispatch({type: 'topic-name', payload: {topicName}})
    }
    const handleSubTopicNameChange = (index, subTopicName) => {
        topicDispatch({type: 'sub-topic-data', payload: {index, subTopicName}})
    }
    const handleSubTopicDescChange = (index, description) => {
        topicDispatch({type: 'sub-topic-data', payload: {index, description}})
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
        // setError(null)
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
        <div className="mt-5 flex justify-center items-center">
            <div className="w-56 sm:w-72 bg-purple-50 shadow-md p-3 pb-5 h-fit">
                <h4 className="font-bold">Add new topic</h4>
                <form onSubmit={handleSubmit}>
                    <label name="topicName" htmlFor="id_topic_name">Topic Name</label>
                    <input className="pl-1 border-2 border-gray-300 rounded w-full" type='text' value={topic.topicName} onChange={(e) => handleTopicNameChange(e.target.value)}/>
                    
                    { topic.subTopics.map( (subTopic, index) => (
                        <div key={index} className="flex flex-col pt-2 ">
                            <div className="flex justify-between">
                                <label htmlFor={`name_${index}`} name={`subTopic_${index}`}>Subtopic {index+1}:</label>
                                { index > 0 && <button type="button" className="" onClick={() => handleDeleteSubTopic(index)}> <DeleteSub /> </button>}
                            </div>
                            <input className="pl-1 border-2 border-gray-300 rounded w-full" type="text" id={`name_${index}`} value={subTopic.subTopicName} onChange={(e) => handleSubTopicNameChange(index, e.target.value)} />

                            <label htmlFor={`desc_${index}`} name={`subTopic_desc_${index}`}>Description:</label>
                            <textarea className="pl-1 border-2 border-gray-300 rounded w-full h-24" type="text" id={`desc_${index}`} value={subTopic.description} onChange={(e) => handleSubTopicDescChange(index, e.target.value)} />
                        </div>
                    ) ) }
                    <button type="button" className="" onClick={handleAddSubTopic}> <AddSub /> </button>

                    <button className="mt-2 block bg-indigo-500 text-white shadow-sm rounded-md w-full h-8" type="submit" disabled={isLoading}>
                        Add Topic
                    </button>
                    {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
                </form>
            </div>
        </div>
    )
}

export default TopicForm