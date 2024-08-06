// import axios from "axios"
import { useState } from "react"
import { useLogin } from "../hooks/useLogin"


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        login(email, password)
    }

    return (
        <div className=" ">
            <form className="flex flex-col mt-28 mb-40 mr-auto ml-auto bg-rose-50 p-3 rounded max-w-72 h-72 min-w-36 shadow-md" onSubmit={handleSubmit}>

                <h3 className="font-bold">Login</h3>

                <label htmlFor="for_email" className="mt-4">Email</label>
                <input className="border-2 rounded p-1" id="for_email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="for_password" className="mt-4">Password</label>
                <input className="border-2 rounded p-1" id="for_password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
                <button className="mt-8 bg-rose-400 rounded p-1 text-white" disabled={isLoading}>Submit</button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
            
        </div>
    )
}

export default Login