import React from 'react';
import './App.css';
import View from "./View"

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            showSignUp: true,
            isRegistered: true
        }
    }

    render() {
        const {showSignUp, isRegistered} = this.state
        return (
            <React.Fragment>
                <div className="page">
                    <h1>Develop Denver 2019</h1>
                {showSignUp ?
                    <React.Fragment>
                        <h3>In order to sign up for shifts, please enter your infomation:</h3>

                        <form>
                            <label> Name:
                                <input
                                    onChange={(event) => this.setState({name: event.target.value.toLowerCase()})}
                                />
                            </label>
                            <label> Email:
                                <input
                                    onChange={(event) => this.setState({email: event.target.value.toLowerCase()})}
                                />
                            </label>
                            {isRegistered ? null :
                                <React.Fragment>
                                    <div className="error">
                                        This email address is not registered. Please enter the email you used when
                                        filling out
                                        the volunteer availablity and contact information form.
                                    </div>
                                    <div className="error">
                                        Contact @michelle on
                                        denverdevs or michelle.bergquist@developdenver.org for help.
                                    </div>
                                </React.Fragment>
                            }
                            <button onClick={(e) => this.submit(e)}>Submit</button>
                        </form>
                    </React.Fragment>
                    : null}
                </div>

                {/* **Sign up View** */}
                {/*{!showSignUp ?*/}
                {/*    <SignUp email={this.state.email} name={this.state.name}/>*/}
                {/*    : null}*/}

                {/* **Shift View** */}
                {!showSignUp ?
                    <View email={this.state.email}/>
                    : null}
            </React.Fragment>
        )
    }


    submit = async (e) => {
        e.preventDefault()
        const {name, email, showSignUp} = this.state

        if (name !== "" && email !== "") {
            App.isVolunteer(email).then(r => {
                if (r) {
                    this.setState({showSignUp: !showSignUp})

                } else {
                    this.setState({isRegistered: false})
                }
            })
        }
    }

    static async isVolunteer(email) {
        const response = await fetch(`/api/volunteer?email=${encodeURIComponent(email)}`)
        return await response.json()
    }
}

export default App;
