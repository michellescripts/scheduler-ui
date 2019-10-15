import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button
          onClick={() =>
            loginWithRedirect({})
          }
        >
          Log in
        </button>
      )}
      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
      {isAuthenticated && (
         <div>
           <Link to="/">Home</Link>&nbsp;
           <Link to="/profile">Profile</Link>
         </div>
       )}
    </div>
  );
};

export default NavBar;
