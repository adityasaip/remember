import { createContext, useEffect, useReducer } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {user: action.payload}
        case 'LOGOUT':
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {user: null})

    // remember that if we refresh the page, the AuthUserContext is going to be set null and the local storage will still hold the user and the token
    // the user is technically logged in but the frontend doesnt see it, so initially we can set the AuthUserContext when the page is rendered, we can use useEffect
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({type: 'LOGIN', payload: user})
        }
    }, [])

    console.log('AuthContext state: ', state)


    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}


