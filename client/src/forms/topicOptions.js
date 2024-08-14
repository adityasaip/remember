import axios from "axios"
import { useState } from "react"
import {ReactComponent as MoreVertIcon} from '../assets/more_vert_16dp_5F6368_FILL0_wght400_GRAD0_opsz20.svg'
import {ReactComponent as OkayIcon} from '../assets/check_30dp_75FB4C_FILL0_wght400_GRAD0_opsz24.svg'
import {ReactComponent as CloseIcon} from '../assets/close_30dp_666666_FILL0_wght400_GRAD0_opsz24.svg'
import { useAuthContext } from "../hooks/useAuthContext"
import { useTopicsContext } from "../hooks/useTopicsContext"
import Modal from "react-modal"

Modal.setAppElement("#root")
// yet to add 'add new sub topic' option. 1 sub topic addition is enough. (Added)
const TopicOptions = ({id, name}) => {

    const [showInput, setShowInput] = useState(false)
    const [topicName, setTopicName] = useState(name)
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showSubTopic, setShowSubTopic] = useState(false)
    const [subTopicName, setSubTopicName] = useState('')
    const [description, setDescription] = useState('')
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
            alert(`Added ${subTopicName} successfully`)
            dispatch({type:'ADD_SUB', payload:{id, subTopic:{subTopicName, description}}})
            setSubTopicName('')
            setDescription('')
        } else {
            alert(`Oops! Error. Cannot add ${subTopicName}`)
        }
        setShowSubTopic(false)
        setIsOpen(false)
    }
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            // maxWidth: '600px',
            borderRadius: '7px',
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)"
        }
      };
    
    return (
        <div className="">
            <button className='relative' onClick={()=>setIsOpen(prev=>!prev)}>{!showInput && !showConfirm && !showSubTopic && <MoreVertIcon />}</button> 
            { isOpen && 
                <div className='bg-slate-100 absolute rounded align-middle pl-2 pr-2 pt-1 pb-1 flex flex-col z-10'> 
                    <p dialog className='border-b-2 cursor-pointer hover:bg-gray-200' onClick={handleEditClick}>Edit name</p>
                    <p className='border-b-2 cursor-pointer hover:bg-gray-200 ' onClick={handleDeleteClick}>Delete</p>
                    <p className="cursor-pointer hover:bg-gray-200" onClick={handleSubTopicClick}>Sub topic +</p>
                </div>   
            }
            
            <Modal
                isOpen={showInput}
                onRequestClose={()=>setShowInput(false)}
                style = {customStyles}
                contentLabel="Edit Topic Modal"
                >
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Edit topic name</h3>
                    <textarea className="w-42 pl-1 h-20 border-gray-400 border-2 rounded-md text-wrap sm:w-52" align="top" type='text' value = {topicName} onChange={(e)=>setTopicName(e.target.value)} />
                    <div className="flex gap-2 justify-end">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditSubmit}>
                            <OkayIcon/>
                        </button>
                        <button className=" bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded" onClick={handleEditCancel}>
                            <CloseIcon/>
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showConfirm}
                onRequestClose={()=>setShowConfirm(false)}
                style = {customStyles}
                contentLabel="Delete Topic Modal"
            >
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <p className="text-wrap">Are you sure you want to delete?</p>
                    <div className="flex gap-2 justify-end">
                        <button className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-15" onClick={handleDeleteSubmit}>
                            Yes
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded w-15" onClick={handleDeleteCancel}>
                            No
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showSubTopic}
                onRequestClose={()=>setShowSubTopic(false)}
                style = {customStyles}
                contentLabel="Add Sub Topic Modal"
            >
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Add subtopic</h3>
                    <textarea className="w-42 pl-1 h-14 border-gray-400 border-2 rounded-md sm:w-52" type='text' value = {subTopicName} placeholder="Subtopic name" onChange={(e)=>setSubTopicName(e.target.value)} />
                    <textarea className="w-42 pl-1 h-32 border-gray-400 border-2 rounded-md sm:w-64" type='text' value = {description} placeholder="Description" onChange={(e)=>setDescription(e.target.value)} />
                
                    <div className="flex gap-2 justify-end">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubTopicSubmit}>
                            <OkayIcon/>
                        </button>
                        <button className=" bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded" onClick={handleSubTopicCancel}>
                            <CloseIcon/>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}


export default TopicOptions