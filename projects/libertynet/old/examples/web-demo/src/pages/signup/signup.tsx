import React, {useState} from 'react'
import {Alert, Button, Form} from "react-bootstrap";
import {Left, Right} from "monet";
import {doSignup, SignupData} from "../../services/communicationService";
import {WaitSpinner} from "../../components/WaitSpinner";


export const Profile: React.FC = () => {
    const [data, setData] = useState<SignupData>({displayName: '', password: '', password2: '',profile: '', username: ''} );
    const [error, setError] = useState<string>('');
    const [toaster, setToaster] = useState<string>('');
    const [waiting, setWaiting] = useState(false)

    const submit = (ev: any) => {
        ev.preventDefault();
        setWaiting(true);
        setError('');
        Right(data)
            .bind(verifyUsernameLength)
            .bind(verifyPasswordLength)
            .bind(verifyPasswordMatch)
            .cata(e => setError(e as string), d =>
                doSignup(d as SignupData)
                    .then(setToaster)
                    .then(() => setWaiting(false))
                    .catch(e => setError(e))
            )
    }


  const updateData = (prop: string) => (ev: any) =>
        setData({
            ...data,
            [prop]: ev.target.value,
        });




    return (
        <div>
            <h1>Signup</h1>
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

                <Form.Group className="mb-3" >
                    <Form.Label>Verify password</Form.Label>
                    <Form.Control type="password" placeholder="Verify password" onChange={updateData('password2')}/>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Display name</Form.Label>
                    <Form.Control type="text" value={data.displayName} placeholder="Display name" onChange={updateData('displayName')}/>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Profile</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={updateData('profile')}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    <WaitSpinner visible={waiting}/>
                    Submit
                </Button>
                <div>Submission can take a while while waiting for confirmation on the network.</div>
            </Form>

        </div>
    );
};






const verifyUsernameLength = (data: SignupData) =>
    data.username.length < 3 ? Left<string, SignupData>('Username must be at least 3 chars') : Right<string, SignupData>(data);

const verifyPasswordLength = (data: SignupData) =>
    data.password.length < 5 ? Left<string, SignupData>('Password too short') : Right<string, SignupData>(data);

const verifyPasswordMatch = (data: SignupData) =>
    data.password === data.password2 ? Right<string, SignupData>(data) : Left<string, SignupData>('Passwords do not match')
