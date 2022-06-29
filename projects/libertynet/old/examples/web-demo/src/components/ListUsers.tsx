import React from "react";
import {User} from "@libertynet/api";
import {ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

export const ListUsers: React.FC<{users: User[]}> = ({users}) => (
    <ListGroup>
        {users.map(user => (
            <Link to={`/user/${user.username}`} key={user.username}><ListGroup.Item >{user.username} ({user.displayName})</ListGroup.Item></Link>
        ))}
    </ListGroup>

)