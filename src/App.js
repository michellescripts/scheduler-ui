import React from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thursdayShifts: [],
            fridayShifts: [],
            assignmentsWithShifts: [],
            showModal: true,
            name: "",
            email: ""
        }
    }

    componentDidMount = async () => {
        this.fetchShifts()
        this.fetchAssignmentsWithShifts()
    }

    render() {
        const {thursdayShifts, fridayShifts, showModal} = this.state

        return (
            <div className="page">

                <h1>Develop Denver 2019</h1>
                <h2>Volunteer Sign up</h2>
                {showModal ?
                    <React.Fragment>
                        <h3>In order to sign up for shifts, please enter your infomation:</h3>

                        <form>
                            <label> Name:
                                <input
                                    onChange={(event) => this.setState({name: event.target.value})}
                                />
                            </label>
                            <label> Email:
                                <input
                                    onChange={(event) => this.setState({email: event.target.value})}
                                />
                            </label>
                            <button onClick={this.submit}>Submit</button>
                        </form>
                    </React.Fragment>
                    : null}


                {!showModal ?
                    <React.Fragment>
                        <h1>Thursday August 15th</h1>
                        <table>
                            {this.getRows(thursdayShifts)}
                        </table>

                        <h1>Friday August 16th</h1>
                        <table>
                            {this.getRows(fridayShifts)}
                        </table>
                    </React.Fragment>
                    : null}


            </div>
        )
    }

    getRows(shifts) {
        const {assignmentsWithShifts} = this.state

        return shifts.map(shift => {
            return (
                <tr>
                    <td>{this.formatTime(shift.shift.hourStart)}</td>
                    <td><b>{shift.available}</b> available</td>
                    <td>
                        {this.getButton(shift)}
                    </td>
                </tr>
            )
        })
    }

    submit = async (e) => {
        const {showModal, name, email} = this.state

        if (name !== "" && email !== "") {
            this.fetchAssignmentsWithShifts()

            this.setState({
                showModal: !showModal
            })
        }
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
            if (assignmentAndShift.assignment.shiftId == shift.shift.primaryId) {
                hasThisShift = true
                assignedShift = assignmentAndShift.assignment.primaryId
            }
        })

        if (hasThisShift && assignedShift) {
            return <button onClick={() => this.removeSignUp(assignedShift)}>Un-sign Up</button>
        } else if (shift.available <= 0 && hasThisShift == false) {
            return <div className='noneLeft'>all full 🙏</div>
        } else {
            return <button onClick={() => this.signUp(shift.shift.primaryId)}>Sign Up</button>
        }

    }

    signUp = async (primaryId) => {
        const {name, email} = this.state

        if (name !== "" && email !== "") {
            await fetch("/assignment", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, shiftId: primaryId})

            })
            this.fetchShifts()
            this.fetchAssignmentsWithShifts()
        } else {
            this.toggleModal()
        }
    }


    removeSignUp = async (primaryId) => {
        await fetch(`/assignment/${primaryId}`, {
            method: "DELETE"
        })
        this.fetchShifts()
        this.fetchAssignmentsWithShifts()
    }

    formatTime(hourStart) {
        let hourEnd = hourStart+1
        if (hourStart > 12) {
            hourStart = hourStart-12
        }

        if (hourEnd > 12) {
            hourEnd = hourEnd-12
        }




        return `${hourStart}:00 - ${hourEnd}:00`

    }
}

export default App;
