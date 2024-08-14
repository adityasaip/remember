import ReviseTopicOptions from "../forms/reviseTopicOptions"



const ReviseTopic = ({topic}) => {

    return (
        <div>
            <h4 className="font-bold pb-2"> {topic.topicName} </h4>
            <ul className="flex flex-col flex-wrap gap-3">
                {topic.subTopics.map(subTopic => (
                    <li className="min-w-48 sm:w-96" key={subTopic._id}>
                        <div className="flex justify-between">
                            <p> {subTopic.subTopicName} </p>
                            <ReviseTopicOptions id={topic._id} subId={subTopic._id}/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ReviseTopic