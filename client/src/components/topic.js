import TopicOptions from "../forms/topicOptions"
import SubTopicOptions from "../forms/subTopicOptions"
import { useState } from "react"

const Topic = ({topic}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <div className="flex justify-between cursor-pointer">
                <h4 className="font-bold bg-green-200 w-full min-h-10 flex justify-center items-center rounded-tl-md hover:bg-green-300"  onClick={() => setIsOpen(prev => !prev)}> {topic.topicName} </h4>
                <div className="bg-green-200 min-h-10 flex items-center rounded-tr-md"><TopicOptions id={topic._id} name={topic.topicName}/></div>
            </div>
            { isOpen &&
            <ul className={`flex flex-col gap-3 bg-green-100 rounded-b-md pl-1`}>
                {topic.subTopics.map(subTopic => (
                    <li className="toDo" key={subTopic._id}>
                        <div className="flex justify-between">
                            <p> <i> Sub topic: </i> {subTopic.subTopicName} </p>
                            <SubTopicOptions id={topic._id} subId={subTopic._id} name={subTopic.subTopicName}/>
                        </div>
                        
                        <p> <i className="text-sm"> Times revised: </i>{subTopic.revisionCount}</p>
                    </li>
                ))}
            </ul>
            }
        </div>
    )
}

export default Topic