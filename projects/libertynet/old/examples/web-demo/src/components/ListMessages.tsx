import React, {useEffect, useState} from "react";
import {readMessagesForUser} from "../services/communicationService";
import {ListGroup} from "react-bootstrap";
import {TextMessage} from "@libertynet/text-message";
import {formatDistance} from 'date-fns'
import {WaitSpinner} from "./WaitSpinner";


export const ListMessages: React.FC<{username: string}> = (props) => {
    const [msgs, setMsgs] = useState<TextMessage[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        setSearching(true);
        readMessagesForUser(props.username)
            .then(setMsgs)
            .then(() => setSearching(false))
    }, [])

    return (
        <ListGroup>
            <WaitSpinner visible={searching}/>
            {msgs.map(msg => (
                <ListGroup.Item key={msg.time}>
                    <div><b>{msg.title}</b></div>
                    <div>{msg.body}</div>
                    <div style={{color: '#aaa', fontSize: '.8em'}}>{formatDistance(new Date(msg.time), new Date())} ago</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )

}