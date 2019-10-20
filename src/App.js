import React from 'react';
import './App.css';
import NavBar from "./nav/NavBar";
import {useAuth0} from "./react-auth0-wrapper";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheckSquare, faTimes, faBars, faUser} from '@fortawesome/free-solid-svg-icons'

library.add(faCheckSquare, faTimes, faBars, faUser)

function App() {
    const {loading} = useAuth0();

    if (loading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <React.Fragment>
            <BrowserRouter>
                <NavBar/>
                <Switch>
                    <Route path="/" exact/>
                    <PrivateRoute path="/profile" component={Profile}/>
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
