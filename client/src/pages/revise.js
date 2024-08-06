import { useEffect, useState } from "react"
import axios from 'axios'
import ReviseTopic from "../components/reviseTopics"
import { useAuthContext } from "../hooks/useAuthContext"

const Revise = () => {
    const [reviseTopics, setReviseTopics] = useState(null)
    const { user } = useAuthContext()
    useEffect(() => {
        // if (!user) {
        //     alert('you must be logged in')
        //     return
        // }
        const fetchTopics = async () => {
            const response = await axios({
                method: 'GET',
                url: '/api/topics/revise',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response.statusText === 'OK') {
                setReviseTopics(response.data)
            } 
            // console.log(response)
        }    
        if (user) {
            fetchTopics() 
        }
    }, [user])      // adding user 
    return (
        <div className="p-3 flex flex-row justify-center gap-10">
            <div className="flex flex-col gap-4 ">
                <h3 className="font-extrabold text-lg text-green-500">Revision Topics</h3>
                {reviseTopics && reviseTopics.map((reviseTopic) => (
                    <ReviseTopic key={reviseTopic._id} topic={reviseTopic}/>
                ))}
            </div>
        </div>
    )
}

export default Revise