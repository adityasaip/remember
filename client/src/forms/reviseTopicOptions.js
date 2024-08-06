import {ReactComponent as COMPLETE} from '../assets/beenhere_24dp_75FB4C_FILL0_wght400_GRAD0_opsz24.svg'
import {ReactComponent as TOBECOMPLETE} from '../assets/beenhere_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'
import axios from 'axios'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'



const ReviseTopicOptions = ({id, subId}) => {
    const [isComplete, setIsComplete] = useState(false)
    const { user } = useAuthContext() 
    // const [isLoading, setIsLoading] = useState(false)
    const handleSubmit = async () => {
        if (!user) {
            alert('you must be logged in')
            return
        }
        const response = await axios({
            method: 'patch',
            url: `/api/topics/revise/${id}/${subId}`,
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200){
            alert('Marked as revised!')
            setIsComplete(true)
        }
        else alert(response.body.error)
    }
    
    return (
        <div>
            <button onClick={handleSubmit} disabled={isComplete}>{ isComplete?<COMPLETE />:<TOBECOMPLETE /> }</button>
        </div>
    )
}

export default ReviseTopicOptions