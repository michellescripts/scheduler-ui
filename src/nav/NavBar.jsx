import React, { useState } from 'react';
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [ menuOpen, setMenuOpen ] = useState(false) ;


  const getMenu = () => {
    return <>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>
          Log in
        </button>
      )}
      {isAuthenticated &&
        <button onClick={() => logout()}>
          Log out
        </button>
      }
      {isAuthenticated && (
         <div>
           <Link to="/">Home</Link>&nbsp;
           <Link to="/profile">Profile</Link>
         </div>
       )}
    </>
  }

  const hamburgerDisplay = () => {
    return <>
      {menuOpen ?
         <FontAwesomeIcon icon="times"  onClick={() => setMenuOpen(false)} /> :
         <FontAwesomeIcon icon="bars" onClick={() => setMenuOpen(true)} /> }
      </>
  }

  return (
    <div>
      <h1>Hey {user ? user.name : "You"}</h1>
      {hamburgerDisplay()}
      {menuOpen ? getMenu() : null}
    </div>
  );
};

export default NavBar;
