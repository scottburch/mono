import React, {useEffect} from "react";
import {doLogout, isLoggedIn, useClient} from "../../services/communicationService";
import {useNavigate} from "react-router-dom";

export const LogoutPage: React.FC = () => {
    const client = useClient();
    const navigate = useNavigate();

    useEffect(() => {
        isLoggedIn(client) ? doLogout() :  navigate('/');
    }, [client])

    return <div>Logging out...</div>
}