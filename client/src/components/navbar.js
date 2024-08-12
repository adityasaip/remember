import { Link } from "react-router-dom"
import {useLogout} from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react"
import {ReactComponent as Person} from "../assets/badge_27dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
import {ReactComponent as LogoutIcon} from "../assets/logout_27dp_EA3323_FILL0_wght400_GRAD0_opsz24.svg"
import {ReactComponent as AddIcon} from "../assets/docs_add_on_27dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
import {ReactComponent as RepeatIcon} from "../assets/repeat_27dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
import {ReactComponent as TopicIcon} from "../assets/topic_27dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"

const Navbar = () => {
    const {logout} = useLogout()
    const {user} = useAuthContext()     // can access user because we spread out the state while providing the context value
    const [dropDown, setDropDown] = useState(false)
    const handleLogoutClick = () => {
        logout()
        setDropDown(false)
    }

    return (
        <header className = "bg-purple-600 p-4 flex flex-wrap gap-y-3 items-center justify-between">
            <div className=" flex items-center ">
                <Link to='/'>
                    <h1 className="mr-4 text-yellow-300 font-bold">Repeat!</h1>
                </Link>
            </div>
            <div className="flex justify-around sm:justify-center flex-1 gap-x-10 font-extrabold"> 
                <Link to='/revise'>
                    <h1 className="text-green-200"><RepeatIcon/></h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-green-200"><TopicIcon/></h1>
                </Link>
                <Link to='/newform'>
                    <h1 className="text-green-200"><AddIcon /></h1>
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
                    <>
                        <button className="relative ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={()=>setDropDown(prev => !prev)}>
                            <Person /> {user.email.split('@')[0]}
                        </button>
                        {dropDown &&
                        <div className=" absolute z-10 ml-4 bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li className="flex px-2 cursor-pointer justify-center" onClick={handleLogoutClick}><LogoutIcon/> Logout</li>
                            </ul>
                        </div>
                        }
                    </>)
                }               
            </div>       
        </header>
    )
}

export default Navbar