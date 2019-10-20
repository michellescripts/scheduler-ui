import React from 'react';
import {useAuth0} from "../react-auth0-wrapper";
import './NavBar.scss'
import {Link} from "react-router-dom"

const NavBar = () => {
    const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

    const getAuthButton = () => {
        return <>
            {isAuthenticated ? <>
                    <Link to="/profile">Profile</Link>
                    <button className="btn-simple" onClick={() => logout()}>Sign Out</button>
                </> :
                <button className="btn-simple" onClick={() => loginWithRedirect({})}>Sign In</button>}
        </>
    }

    return (
        <header>
            <h1>Hey {user ? user.name : "You"}</h1>
            {getAuthButton()}
        </header>
    );
};

export default NavBar;
