import axios from "axios"
import { useState } from "react"
import {ReactComponent as MoreVertIcon} from '../assets/more_vert_16dp_5F6368_FILL0_wght400_GRAD0_opsz20.svg'
import { useAuthContext } from "../hooks/useAuthContext"
import { useTopicsContext } from "../hooks/useTopicsContext"

// yet to add 'add new sub topic' option. 1 sub topic addition is enough. (Added)
const TopicOptions = ({id, name}) => {

    const [showInput, setShowInput] = useState(false)
    const [topicName, setTopicName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showSubTopic, setShowSubTopic] = useState(false)
    const [subTopicName, setSubTopicName] = useState('')
    const {user} = useAuthContext()
    const {dispatch} = useTopicsContext()

    const handleEditClick = () => {
        setShowInput(prev=>!prev)
        setIsOpen(prev=>!prev)
    }
    const handleDeleteClick = () => {
        setIsOpen(false)
        setShowConfirm(true)
    }

    const handleEditSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: 'patch',
            url: `/api/topics/${id}`,
            data: {topicName},
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }  
        })
        setShowInput(false)
        // I also yet to change the client side data as it doesnot refetch data when changed on the database, so I should keep these both in sync. For this I need to use context api, or import props and setFunction.
        if (response.status === 200) {
            alert(`Updated ${name} to ${topicName} successfully`)
            dispatch({type: 'EDIT_TOPICNAME', payload: {topicName, id}})
        }
    }   

    const handleEditCancel = () => {
        setShowInput(false)
        setTopicName(name)
    }

    const handleDeleteSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: "delete",
            url: `/api/topics/${id}`,
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        setShowConfirm(true)
        if (response.status === 200) {
            alert(`Deleted ${topicName} successfully`)
            dispatch({type: 'DELETE_TOPIC', payload: {id}})
        }
    }

    const handleDeleteCancel = () => {
        setShowConfirm(false)
    }

    const handleSubTopicClick = () => {
        setShowSubTopic((prev)=>!prev)
        setIsOpen(false)
    }
    const handleSubTopicCancel = () => {
        setShowSubTopic(false)
        setIsOpen(false)
        
    }
    const handleSubTopicSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: "post",
            url: `/api/topics/${id}`,
            data: {subTopicName: subTopicName},
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200){
            setSubTopicName('')
            alert(`Added ${subTopicName} successfully`)
        } else {
            alert(`Oops! Error. Cannot add ${subTopicName}`)
        }
        setShowSubTopic(false)
        setIsOpen(false)
    }

    return (
        <div className="">
            <button className='relative' onClick={()=>setIsOpen(prev=>!prev)}>{!showInput && !showConfirm && !showSubTopic && <MoreVertIcon />}</button> 
            { isOpen && 
                <div className='bg-slate-100 absolute rounded align-middle pl-2 pr-2 pt-1 pb-1 flex flex-col z-10'> 
                    <p className='border-b-2 cursor-pointer' onClick={handleEditClick}>Edit name</p>
                    <p className='border-b-2 cursor-pointer ' onClick={handleDeleteClick}>Delete</p>
                    <p className="cursor-pointer" onClick={handleSubTopicClick}>Sub topic +</p>
                </div> 
            }
            {/* { !showInput && !showConfirm && <button type="button" className="bg-slate-600 hover:bg-yellow-500 text-white rounded-md shadow-md w-32" onClick = {() => setShowInput(true)}>Edit Name</button>} */}
            { showInput && 
            <div className="flex items-center gap-2 z-10">
                <input className="w-32 border-black border-2 rounded" type='text' value = {topicName} onChange={(e)=>setTopicName(e.target.value)} />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditSubmit}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M3.293 10.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 0 1.414 0l8-8a1 1 0 1 1 1.414 1.414l-8 8a3 3 0 0 1-4.243 0l-5-5a1 1 0 0 1 0-1.414z"/>
                    </svg>
                </button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded" onClick={handleEditCancel}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 1 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 1.414-1.414L10 8.586z"/>
                    </svg>
                </button>
            </div>
            }

            {/* { !showConfirm && !showInput && <button type="button" className="bg-red-400 hover:bg-red-500 text-white rounded-md shadow-md w-32" onClick={()=>{setShowConfirm(true)}}>Delete</button>} */}
            { showConfirm && 
            <div className="flex items-center gap-2">
                <p>Are you sure?</p>
                <button className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-15" onClick={handleDeleteSubmit}>
                    Yes
                </button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded w-15" onClick={handleDeleteCancel}>
                    No
                </button>
            </div>
            }

            { showSubTopic &&
                <div className="flex items-center gap-2 z-10">
                <input className="w-32 border-black border-2 rounded pl-1" type='text' value = {subTopicName} placeholder="subtopic name" onChange={(e)=>setSubTopicName(e.target.value)} />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubTopicSubmit}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M3.293 10.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 0 1.414 0l8-8a1 1 0 1 1 1.414 1.414l-8 8a3 3 0 0 1-4.243 0l-5-5a1 1 0 0 1 0-1.414z"/>
                    </svg>
                </button>
                <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded" onClick={handleSubTopicCancel}>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 8.586l3.293-3.293a1 1 0 0 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 1 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 1.414-1.414L10 8.586z"/>
                    </svg>
                </button>
            </div>
            }
        </div>
    )
}


export default TopicOptions