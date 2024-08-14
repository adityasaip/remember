import TopicOptions from "../forms/topicOptions"
import SubTopicOptions from "../forms/subTopicOptions"
import { useState } from "react"
import {ReactComponent as DescIcon} from "../assets/description_24dp_434343_FILL0_wght400_GRAD0_opsz24.svg"
import Modal from 'react-modal'

Modal.setAppElement('#root')

const Topic = ({topic}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSubTopic, setSelectedSubTopic] = useState(false)
    
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            height: '80vh',
            width: '80vw',
            borderRadius: '7px',
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)"
        }
    };
    return (
        <div>
            <div className="flex justify-between cursor-pointer">
                <h4 className="font-bold bg-green-200 w-full min-h-10 flex justify-center items-center rounded-tl-md hover:bg-green-300"  onClick={() => setIsOpen(prev => !prev)}> {topic.topicName} </h4>
                <div className="bg-green-200 min-h-10 flex items-center rounded-tr-md"><TopicOptions id={topic._id} name={topic.topicName}/></div>
            </div>
            { isOpen &&
            <ul className="flex flex-col bg-green-100 rounded-b-md  divide-gray-400 divide-y">
                {topic.subTopics.map(subTopic => (
                    <li className="bg-slate-200 p-2 " key={subTopic._id} >
                        <div className="flex justify-between">
                            <div className="flex w-full cursor-pointer" onClick={()=>setSelectedSubTopic(subTopic)}> <DescIcon/> {subTopic.subTopicName} </div>
                            <SubTopicOptions id={topic._id} subId={subTopic._id} name={subTopic.subTopicName} desc={subTopic.description}/>
                        </div>
                        <p> <i className="text-sm pl-1"></i>{subTopic.revisionCount}</p>
                        { selectedSubTopic && 
                        <Modal
                            isOpen={!!selectedSubTopic}
                            onRequestClose={()=>setSelectedSubTopic(null)}
                            style = {customStyles}
                            contentLabel="Desc Modal"
                        >
                            <div className="flex flex-col h-full divide-y">
                                <p className="flex-none">{selectedSubTopic.subTopicName}</p>
                                <p className="flex-grow pt-1">{selectedSubTopic.description}</p>
                                <div className="text-right pt-1">
                                    <button className="flex-none bg-gray-200 hover:bg-slate-300 w-20 p-1 rounded-md" onClick={()=>setSelectedSubTopic(null)}>Cancel</button>
                                </div>
                            </div>
                            
                        </Modal>
                        }
                    </li>
                ))}
            </ul>
            }
        </div>
    )
}

export default Topic