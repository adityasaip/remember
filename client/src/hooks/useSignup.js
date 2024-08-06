import { useState } from "react"
import axios from 'axios'
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios({
                method: 'post',
                url: '/api/user/signup',
                data: {email, password}
            })
            
            // save token and user data to local storage
            localStorage.setItem('user', JSON.stringify(response.data))     // key, value - both must be strings, so stringified

            // update auth context
            dispatch({type: 'LOGIN', payload: response.data})

            setIsLoading(false)

        } catch (error) {
            // console.log("*********",error.response, "**********")   // check console.log(error) too, gives better idea. The thrown error at the backend will be in the error.response.data eg: error.response.data = {error: Pw not strong enough}, if we do not use try catch, whole page crashes, so we should handle every possible error
            setError(error.response.data.error)
            setIsLoading(false)
        }
        
    }  
    return {signup, isLoading, error}
}

// if (response.status!==200){
//     setIsLoading(false)
//     console.log(response)
//     setError(response.data.error)
    
// }