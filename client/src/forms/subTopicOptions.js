import {ReactComponent as MoreVertIcon} from '../assets/more_vert_16dp_5F6368_FILL0_wght400_GRAD0_opsz20.svg'
import {useState} from 'react'
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTopicsContext } from '../hooks/useTopicsContext';

const SubTopicOptions = ({id, subId, name}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showEdit, setShowEdit] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [subTopicName, setSubTopicName] = useState(name)
    const {user} = useAuthContext()
    const {dispatch} = useTopicsContext()

    const handleEditClick = () => {
        setShowEdit(prev=>!prev)
        setIsOpen(prev=>!prev)
    }
    const handleEditCancel = () => {
        setShowEdit(prev=>!prev)
        setIsOpen(prev=>!prev)
        setSubTopicName(name)
    }
    const handleEditSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: 'patch',
            url: `/api/topics/${id}/${subId}`,
            data: {subTopicName},
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            dispatch({type: 'EDIT_SUB_NAME', payload: {id, subId, subTopicName}})
            alert(`Updated ${name} to ${subTopicName} successfully`)
        }
        setShowEdit(false)
        setIsOpen(false)
    }
    const handleDeleteClick = () => {
        setIsOpen(false)
        setShowConfirm(true)
    }
    const handleDeleteCancel = () => {
        setIsOpen(false)
        setShowConfirm(false)
    }
    const handleDeleteSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: 'delete',
            url: `/api/topics/${id}/${subId}`,
            data: {subTopicName},
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            dispatch({type: 'DELETE_SUB', payload: {id, subId}})
            alert(`Deleted ${subTopicName} successfully`)
        }
        setIsOpen(false)
        setShowConfirm(false)
    }
    
    return (
        <div className=''>
            <button className='relative' onClick={()=>setIsOpen(prev=>!prev)}><MoreVertIcon /></button> 
            { isOpen && 
                <div className='bg-slate-100 absolute rounded align-middle pl-2 pr-2 pt-1 pb-1 flex flex-col z-10'> 
                    <p className='border-b-2 cursor-pointer' onClick={handleEditClick}>Edit name</p>
                    <p className='cursor-pointer ' onClick={handleDeleteClick}>Delete</p>
                </div> 
            }
            { showEdit && 
                <div className="mt-2 flex items-center gap-2">
                    <input className="w-32 border-black border-2 rounded" type='text' value = {subTopicName} onChange={(e)=>setSubTopicName(e.target.value)} />
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

            { showConfirm && 
                <div className="mt-2 flex items-center gap-2">
                    <p>Are you sure?</p>
                    <button className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-15" onClick={handleDeleteSubmit}>
                        Yes
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded w-15" onClick={handleDeleteCancel}>
                        No
                    </button>
                </div>
            }
        </div>
    )
}

export default SubTopicOptions