import { Link } from "react-router-dom"
import {useLogout} from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"


const Navbar = () => {
    const {logout} = useLogout()
    const {user} = useAuthContext()     // can access user because we spread out the state while providing the context value
    
    const handleLogoutClick = () => {
        logout()
    }

    return (
        <header className = "bg-purple-500 p-4 flex items-center justify-between">
            <div className="  flex items-center">
                <Link to='/'>
                    <h1 className="mr-4 text-yellow-400 font-bold">Repeat!</h1>
                </Link>
            </div>
            <div className="flex justify-center flex-1 space-x-4 font-extrabold "> 
                <Link to='/revise'>
                    <h1 className="text-orange-300">Revise</h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-green-300">All Topics</h1>
                </Link>
                <Link to='/newform'>
                    <h1 className="text-amber-300">New Topic</h1>
                </Link>
            </div>   
            <div>
                { !user && (
                    <div className="flex items-center">
                        <Link to='/login'>
                            <h1 className="text-white ml-4">Login</h1>
                        </Link>
                        <Link to='/signup'>
                            <h1 className="text-white ml-4">Signup</h1>
                        </Link>
                    </div>
                )}
                { user && (
                    <div>
                        <span className="mr-2">{user.email.split('@')[0]}</span>
                        <button className="bg-red-400 rounded w-16 text-white" onClick={handleLogoutClick}>Logout</button>
                    </div> 
                )}               
            </div>       
        </header>
    )
}

export default Navbar