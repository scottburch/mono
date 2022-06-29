import React from 'react'
import {Routes, Route, useParams, HashRouter} from 'react-router-dom';

import {Home} from '../pages/home';
import {Profile} from '../pages/signup/signup';
import {Header} from './header';
import {UserPage} from "../pages/user";
import {NewMessage} from "../pages/new-message";
import {Login} from "../pages/login/login";
import {LogoutPage} from "../pages/logout/logout";
import {SearchUsers} from "./search-users";

export const App: React.FC = () => {
    return (
        <div>
            <HashRouter>
                <Header/>
                <div style={{padding: 20}}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/users" element={<SearchUsers/>}/>
                        <Route path="/signup" element={<Profile/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/logout" element={<LogoutPage/>} />
                        <Route path="/user/:username" element={<UserRoute/>}/>
                        <Route path="/new-message" element={<NewMessage/>}/>
                    </Routes>
                </div>
            </HashRouter>
        </div>
    );
};

const UserRoute: React.FC = () => {
    let {username} = useParams()
    return <UserPage username={username || ''}/>;
}





