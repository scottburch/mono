import React, {useEffect, useState} from 'react'
import {Alert, Button, Form} from "react-bootstrap";
import {Right} from "monet";
import {doLogin, isLoggedIn, LoginData, useClient} from "../../services/communicationService";
import {useNavigate} from "react-router-dom";


export const Login: React.FC = () => {
    const [data, setData] = useState<LoginData>({password: '', username: ''} );
    const [error, setError] = useState<string>('');
    const [toaster, setToaster] = useState<string>('')
    const client = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn(client)){
            return navigate("/");
        }
    },[client]);

    const submit = (ev: any) => {
        ev.preventDefault();
        setError('');
        Right(data)
            .cata(e => setError(e as string), d =>
                doLogin(d as LoginData)
                     .then(setToaster)
                    .catch(e => setError(e))
            )
    }


    const updateData = (prop: string) => (ev: any) =>
        setData({
            ...data,
            [prop]: ev.target.value,
        });




    return  (
        <div>
            <h1>Login</h1>
            {error ? (
                <Alert variant="danger">
                    {error}
                </Alert>
            ) : ''}
            {toaster ? (
                <Alert variant="success">
                    {toaster}
                </Alert>
            ) : ''}

            <Form onSubmit={submit}>
                <Form.Group className="mb-3" >
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username (3 - 15 chars)" onChange={updateData('username')}/>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={updateData('password')}/>
                    <Form.Text className="text-muted">
                        Your password is your key to your data.  Do not lose it, we can not recover a lost password.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>

        </div>
    );
};





