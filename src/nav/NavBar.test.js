import React from 'react';
import {shallow} from 'enzyme';
import NavBar from "./NavBar"
import "../enzyme_config.js"

import {useAuth0} from '../react-auth0-wrapper';
import {Link} from "react-router-dom"

const user = {
    name: 'John Doe',
    email: 'johndoe@me.com',
    email_verified: true,
    sub: 'google-oauth2|2147627834623744883746',
};

jest.mock('../react-auth0-wrapper');

describe('NavBar', () => {
    describe('Authenticated NavBar', () => {
        beforeEach(() => {
            useAuth0.mockReturnValue({
                loading: true,
                user,
                logout: jest.fn(),
                loginWithRedirect: jest.fn(),
                isAuthenticated: true,
            });
        });

        it('displays the users name', () => {
            const wrapper = shallow(<NavBar/>);
            expect(wrapper.find('h1').text()).toEqual('Hey John Doe')

        });

        it('displays the log out option for a logged in user', () => {
            const wrapper = shallow(<NavBar/>);
            expect(wrapper.find('button').text()).toEqual('Sign Out')
            expect(wrapper.find(Link).exists()).toEqual(true);
        });

    })

    describe('Un-Authenticated NavBar', () => {
        beforeEach(() => {
            useAuth0.mockReturnValue({
                loading: true,
                user: null,
                logout: jest.fn(),
                loginWithRedirect: jest.fn(),
                isAuthenticated: false,
            });
        });

        it('displays a default message', () => {
            const wrapper = shallow(<NavBar/>);
            expect(wrapper.find('h1').text()).toEqual('Hey You')
        });

        it('displays the menu for an unauthd user', () => {
            const wrapper = shallow(<NavBar/>);

            expect(wrapper.find('button').text()).toEqual('Sign In')
            expect(wrapper.find(Link).exists()).toEqual(false);
        });
    })
})
