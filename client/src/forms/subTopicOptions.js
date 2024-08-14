import {ReactComponent as MoreVertIcon} from '../assets/more_vert_16dp_5F6368_FILL0_wght400_GRAD0_opsz20.svg'
import {ReactComponent as OkayIcon} from '../assets/check_30dp_75FB4C_FILL0_wght400_GRAD0_opsz24.svg'
import {ReactComponent as CloseIcon} from '../assets/close_30dp_666666_FILL0_wght400_GRAD0_opsz24.svg'
import {useState} from 'react'
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTopicsContext } from '../hooks/useTopicsContext';
import Modal from 'react-modal'

Modal.setAppElement('#root')    // need to attach the modal to top element, to come above it

const SubTopicOptions = ({id, subId, name, desc}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showEdit, setShowEdit] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [subTopicName, setSubTopicName] = useState(name)
    const [showDesc, setShowDesc] = useState(false)
    const [description, setDescription] = useState(desc)
    const {user} = useAuthContext()
    const {dispatch} = useTopicsContext()

    const handleEditClick = () => {
        setShowEdit(true)
        setIsOpen(false)
    }
    const handleEditCancel = () => {
        setShowEdit(false)
        setIsOpen(false)
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
            dispatch({type: 'EDIT_SUB_DATA', payload: {id, subId, subTopicName}})
            // alert(`Updated ${name} to ${subTopicName} successfully`)
        }
        setShowEdit(false)
        setIsOpen(false)
    }


    const handleEditDescClick = () => {
        setShowDesc(true)
        setIsOpen(false)
    }
    const handleEditDescCancel = () => {
        setShowDesc(false)
        setIsOpen(false)
        setDescription(desc)
    }
    const handleEditDescSubmit = async () => {
        if (!user) {
            alert(`Please login first`)
            return
        }
        const response = await axios({
            method: 'patch',
            url: `/api/topics/${id}/${subId}`,
            data: {description},
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            dispatch({type: 'EDIT_SUB_DATA', payload: {id, subId, description}})
            // alert(`Updated ${name} to ${subTopicName} successfully`)
        }
        setIsOpen(false)
        setShowDesc(false)
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
            // alert(`Deleted ${subTopicName} successfully`)
        }
        setIsOpen(false)
        setShowConfirm(false)
    }
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            borderRadius: '7px',
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)"
        }
    };
    const customStyles_2 = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            width: '80vw',
            transform: 'translate(-50%, -50%)',
            borderRadius: '7px',
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)"
        }
    };
    return (
        <div className=''>
            <button className='relative' onClick={()=>setIsOpen(prev=>!prev)}><MoreVertIcon /></button> 
            {isOpen &&
                <div className='bg-slate-100 absolute rounded align-middle pl-2 pr-2 pt-1 pb-1 flex flex-col z-10'> 
                    <p className='border-b-2 cursor-pointer hover:bg-gray-200' onClick={handleEditClick}>Edit name</p>
                    <p className='border-b-2 cursor-pointer hover:bg-gray-200' onClick={handleEditDescClick}>Edit Description</p>
                    <p className='cursor-pointer hover:bg-gray-200' onClick={handleDeleteClick}>Delete</p>
                </div> 
            }

            <Modal
                isOpen={showEdit}
                onRequestClose={()=>setShowEdit(false)}
                style = {customStyles}
                contentLabel="Edit SubTopic Modal"
            >
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Edit subtopic name</h3>
                    <textarea className="w-42 pl-1 h-20 border-gray-400 border-2 rounded-md text-wrap sm:w-52" type='text' value = {subTopicName} onChange={(e)=>setSubTopicName(e.target.value)} />
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
                isOpen={showDesc}
                onRequestClose={()=>setShowDesc(false)}
                style = {customStyles_2}
                contentLabel="Edit SubTopic desc Modal"
            >
                <div className="flex flex-col gap-2">
                    <textarea className="w-full pl-1 h-20 border-gray-400 border-2 rounded-md text-wrap" type='text' value = {description} onChange={(e)=>setDescription(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditDescSubmit}>
                            <OkayIcon/>
                        </button>
                        <button className=" bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded" onClick={handleEditDescCancel}>
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
        </div>
    )
}

export default SubTopicOptions