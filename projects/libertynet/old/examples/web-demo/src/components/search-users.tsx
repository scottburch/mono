import React, {useState} from 'react'
import {Button, Form, InputGroup} from "react-bootstrap";
import {doSearchUsers} from "../services/communicationService";
import {User} from "@libertynet/api";
import {ListUsers} from "./ListUsers";
import {WaitSpinner} from "./WaitSpinner";

export const SearchUsers: React.FC = () => {
    const [text, setText] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [searching, setSearching] = useState(false)

    const doSearch = () => {
        setSearching(true);
        doSearchUsers(text)
            .then(users => {
                setUsers(users);
                setSearching(false);
            });
    }

    return (
        <>
            <InputGroup className="mb-3">
                <Form.Control type="text" placeholder="Search usernames" onChange={ev => setText(ev.target.value)}/>
                <Button variant="secondary" id="button-addon2" onClick={doSearch}>
                    <WaitSpinner visible={searching}/>
                    Search
                </Button>
            </InputGroup>
            <ListUsers users={users}/>
        </>
    )
}

