import React, {useEffect, useState} from 'react'
import {readUserInfo} from "../../services/communicationService";
import {User} from "@libertynet/api";
import {ListMessages} from "../../components/ListMessages";
import {WaitSpinner} from "../../components/WaitSpinner";

export const UserPage: React.FC<{username: string}> = ({username}) => {
    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        readUserInfo(username)
            .then(user => setUser(user))
            .then(() => setLoading(false));
    }, [!!user?.username])

    return loading ? <WaitSpinner visible={true}/> : (
        <>
            <h4>{user?.username} ({user?.displayName})</h4>
            {user?.username ? (
                <ListMessages username={user.username} />
            ) : null}
        </>
)}