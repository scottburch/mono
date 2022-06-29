import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {isLoggedIn, sendTextMsg, useClient} from "../../services/communicationService";
import {useNavigate} from "react-router-dom";
import {WaitSpinner} from "../../components/WaitSpinner";

export const NewMessage: React.FC = () => {
    const [msgData, setMsgData] = useState({title: '', body: ''});
    const navigate = useNavigate();
    const client = useClient();
    const [sending, setSending] = useState(false);

    useEffect(() => {
        isLoggedIn(client) || navigate('/');
    }, [client, navigate])



    const send = (ev: any) => {
        ev.preventDefault();
        setSending(true);
        sendTextMsg(msgData)
            .then(() => navigate(`/user/${client.username}`))
    }

    const updateData = (prop: string) => (ev:  any) =>
        setMsgData({...msgData, [prop]: ev.target.value})

    return (
        <>
            <Form onSubmit={send}>
                <Form.Group className="mb-3" >
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" onChange={updateData('title')}/>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Control as="textarea" rows={3} onChange={updateData('body')}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    <WaitSpinner visible={sending}/>
                    Send
                </Button>
                <div>Submission can take a while while waiting for confirmation on the network.</div>

            </Form>

        </>
    )
}