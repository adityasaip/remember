
import { useState } from "react"
import { useSignup } from "../hooks/useSignup"


const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password)
    }
 
    return (
        <div className=" ">
            <form className="flex flex-col mt-28 mb-40 mr-auto ml-auto bg-rose-50 p-3 rounded max-w-72 min-h-fit min-w-36 shadow-md" onSubmit={handleSubmit}>

                <h3 className="font-bold">Signup</h3>

                <label htmlFor="for_email" className="mt-4">Email</label>
                <input className="border-2 rounded p-1" id="for_email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="for_password" className="mt-4">Password</label>
                <input className="border-2 rounded p-1" id="for_password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
                <button type="submit" className="mt-8 bg-rose-400 rounded p-1 text-white" disabled={isLoading}>Submit</button>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <p className="text-sm mt-5">A password should contain</p>
                <ul className="text-xs"> 
                    <li> - Minimum 8 characters</li>
                    <li> - Atleast 1 capital letter</li>
                    <li> - Atleast 1 small letter</li>
                    <li> - Atleast 1 special character</li>
                    <li> - Atleast 1 digit</li>
                </ul>
            </form>

        </div>
    )
}

export default Signup