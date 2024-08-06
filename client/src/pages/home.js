import { useEffect } from "react"
import axios from 'axios'
import Topic from "../components/topic"
import { useAuthContext } from '../hooks/useAuthContext'
import { useTopicsContext } from "../hooks/useTopicsContext"

const Home = () => {
    // const [topics, setTopics] = useState(null)   // not needed because we use TopicsContext now
    const { topics, dispatch } = useTopicsContext()
     
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchTopics = async () => {
            const response = await axios({
                method: 'GET',
                url: '/api/topics',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response.statusText === 'OK') {
                dispatch({type: 'SET_TOPICS', payload: response.data})    // documents will be retrieved in an array
            } 
            // console.log(response)
        }
        if (user) {
            fetchTopics() 
        }    
    }, [dispatch, user])    // dispatch is a function which is added to dependency here, for functions, it just checks if the reference is pointing to the same function, the functions for which the reference doesnt change is a stable function
    // so dispatch is a stable function, the term dispatch will hold the same function in it. But () => {} these inline functions are not encouraged to be used in dependency arrays, because a new function instance is created on every render, so useEffect runs again. But dispatch remains same on re-renders, so re run of useEffect will not happen
    // user initially might be null so the fetch doesnt work and when the user is updated, useEffect should run to fetch, so user added to dependency
    // and also general rule of thumb is, if we use something inside useEffect, we should use it as dependency for useEffect to work correctly.
    return (
        <div className="p-3 flex flex-row justify-center ">
            <div className="flex flex-col gap-4 w-full max-w-lg min-w-36">
                <h3 className="font-extrabold text-lg text-green-500">All Topics</h3>
                {topics && topics.map((topic) => (
                    <Topic key={topic._id} topic={topic}/>
                ))}
            </div>
            
            {/* <TopicForm /> */}
        </div>
    )
}


export default Home


// React’s context provider re-renders all components that are consuming the context whenever the context’s state changes.
// How the Update Propagates
// Here’s how the state update propagates through the component:

// Initial Render:

// During the initial render, works is null because that’s the default value provided by the context.
// Effect Hook and Dispatch:

// On the initial render, the useEffect hook runs after the component mounts, performs data fetching, and then dispatches the action to update the context.
// Re-render on Context Update:

// When the dispatch call updates the context state, React triggers a re-render for any components consuming that context.
// During this re-render, useWorks will retrieve the updated value of works from the context, which now contains the fetched data.