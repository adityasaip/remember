import ReviseTopicOptions from "../forms/reviseTopicOptions"



const ReviseTopic = ({topic}) => {

    return (
        <div>
            <div className="flex justify-between">
                <h4 className="font-bold pb-2"> {topic.topicName} </h4>
            </div>
            <ul className="flex flex-col gap-3">
                {topic.subTopics.map(subTopic => (
                    <li className="toDo" key={subTopic._id}>
                        <div className="flex justify-between">
                            <p> <i> Sub topic: </i> {subTopic.subTopicName} </p>
                            <ReviseTopicOptions id={topic._id} subId={subTopic._id}/>
                            {/* <SubTopicOptions id={topic._id} subId={subTopic._id} name={subTopic.subTopicName}/> */}
                        </div>
                        {/* <p> <i className="text-sm"> Times revised: </i>{subTopic.revisionCount}</p> */}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ReviseTopic