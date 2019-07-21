import React from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thursdayShifts: [],
            fridayShifts: [],
            assignmentsWithShifts: [],
            showSignUp: true,
            name: "",
            email: "",
            isRegistered: true
        }
    }

    componentDidMount() {
        this.fetchShifts()
        this.fetchAssignmentsWithShifts()
    }

    render() {
        const {thursdayShifts, fridayShifts, showSignUp, isRegistered} = this.state

        return (
            <div className="page">

                <h1>Develop Denver 2019</h1>
                <h2>Volunteer Sign up</h2>
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
                                    This email address is not registered. Please enter the email you used when filling out
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


                {!showSignUp ?
                    <React.Fragment>
                        <h1>Thursday August 15th</h1>
                        <table>
                            <tbody>
                            {this.getRows(thursdayShifts)}
                            </tbody>
                        </table>

                        <h1>Friday August 16th</h1>
                        <table>
                            <tbody>
                            {this.getRows(fridayShifts)}
                            </tbody>
                        </table>
                    </React.Fragment>
                    : null}


            </div>
        )
    }

    getRows(shifts) {
        return shifts.map((shift, i) => {
            return (
                <tr key={i}>
                    <td>{App.formatTime(shift.shift.hourStart)}</td>
                    <td>{shift.available} available</td>
                    <td>{this.getButton(shift)}</td>
                </tr>
            )
        })
    }

    submit = async (e) => {
        e.preventDefault()
        const {name, email, showSignUp} = this.state

        if (name !== "" && email !== "") {
            App.isVolunteer(email).then(r => {
                if (r) {
                    this.fetchAssignmentsWithShifts()
                    this.setState({showSignUp: !showSignUp})

                } else {
                    this.setState({isRegistered: false})
                }
            })
        }
    }

    static async isVolunteer(email) {
        const response = await fetch(`/volunteer?email=${encodeURIComponent(email)}`)
        return await response.json()
    }

    fetchShifts = async () => {
        const response = await fetch("/shifts")
        const shifts = await response.json()

        this.setState({
            thursdayShifts: shifts.filter(shift => shift.shift.day === "Thursday"),
            fridayShifts: shifts.filter(shift => shift.shift.day === "Friday")
        })
    }

    fetchAssignmentsWithShifts = async () => {
        const {email} = this.state

        if (email) {
            const encoded = encodeURIComponent(email)
            const response = await fetch(`/assignment?email=${encoded}`)
            const assignments = await response.json()
            this.setState({assignmentsWithShifts: assignments})
        }
    }

    getButton(shift) {
        const {assignmentsWithShifts} = this.state
        let hasThisShift = false
        let assignedShift = ""

        assignmentsWithShifts.forEach(assignmentAndShift => {
            if (assignmentAndShift.assignment.shiftId === shift.shift.primaryId) {
                hasThisShift = true
                assignedShift = assignmentAndShift.assignment.primaryId
            }
        })

        if (hasThisShift && assignedShift) {
            return <button onClick={(e) => this.removeSignUp(e, assignedShift)}>Cancel</button>
        } else if (shift.available <= 0 && hasThisShift === false) {
            return <div className='noneLeft'>all full <span role="img" aria-label="thank you pray emoji">🙏</span></div>
        } else {
            return <button onClick={(e) => this.signUp(e, shift.shift.primaryId)}>Sign Up</button>
        }

    }

    signUp = async (e, primaryId) => {
        e.preventDefault()

        const {name, email} = this.state

        if (name !== "" && email !== "") {
            await fetch("/assignment", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, shiftId: primaryId})
            })
            this.fetchShifts()
            this.fetchAssignmentsWithShifts()
        }
    }


    removeSignUp = async (e, primaryId) => {
        e.preventDefault()

        await fetch(`/assignment/${primaryId}`, {method: "DELETE"})
        this.fetchShifts()
        this.fetchAssignmentsWithShifts()
    }

    static formatTime(hourStart) {
        let hourEnd = hourStart + 1

        if (hourStart > 12) {
            hourStart = hourStart - 12
        }
        if (hourEnd > 12) {
            hourEnd = hourEnd - 12
        }

        return `${hourStart}:00 - ${hourEnd}:00`
    }
}

export default App;
