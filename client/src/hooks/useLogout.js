import { useAuthContext } from './useAuthContext'
import { useTopicsContext } from './useTopicsContext'

export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const {dispatch: topicsDispatch} = useTopicsContext()   // dispatch function is assigned to topicsDispatch 
    const logout = () => {
        // remove user and token from local storage
        // this removes data from local storage
        localStorage.removeItem('user')
        
        // dipatch and set user to null
        dispatch({type: 'LOGOUT'})

        // dispatch and set TopicsContext to null, otherwise the previous user's topics flash for the time that it takes to SET_TOPICS of new logged in user.
        topicsDispatch({type: 'SET_TOPICS', payload: null})     // now we are clearing global topics state when logging out
    }
    return {logout}
}

// export default useLogout
// this above works when i import without using {}, eg: import useLogout from 'pathdirectory' not import {useLogout}, this flower brackets work with named or inline exports (the way we can export multiple things from a file) 