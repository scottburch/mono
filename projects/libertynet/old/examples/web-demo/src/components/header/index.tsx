import React from 'react'
import {NavLink} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import {isLoggedIn, useClient} from "../../services/communicationService";

export const Header: React.FC = () => {
    const client = useClient();

    return (
        <header style={{backgroundColor: '#063cb7', color: 'white', padding: 5}}>
            <h1>LibertyNet demo</h1>
            <nav>
                <NavLink to="/" style={linkStyle}>
                    Home
                </NavLink>
                {!isLoggedIn(client) ? (
                    <>
                        <NavLink to="/signup" style={linkStyle}>
                            Signup
                        </NavLink>
                        <NavLink to="/login" style={linkStyle}>
                            Login
                        </NavLink>
                    </>
                ) : null}
                {isLoggedIn(client) ? (
                    <>
                        <NavLink to="/new-message" style={linkStyle}>
                            Post message
                        </NavLink>
                        <NavLink to="/logout" style={linkStyle}>
                            Logout
                        </NavLink>

                    </>
                ) : null}
                <NavLink to="/users" style={linkStyle}>
                    Search Users
                </NavLink>
            </nav>
        </header>
    );
};

const linkStyle = ({isActive}: { isActive: boolean }) =>
    isActive ? {...styles.link, ...styles.active} : styles.link


const styles = {
    link: {
        color: 'white',
        paddingRight: 10
    },
    active: {
        color: '#7f88f3'
    }
}



