import React from 'react';

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thursdayShifts: [],
            fridayShifts: [],
            assignmentsWithShifts: [],
        }
    }

    componentDidMount() {
        this.fetchShifts()
        this.fetchAssignmentsWithShifts()
    }

    render() {
        const {thursdayShifts, fridayShifts} = this.state

        return (
            <div className="page">
                    <React.Fragment>
                        <h2>Volunteer Sign up</h2>
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
            </div>
        )
    }

    getRows(shifts) {
        return shifts.map((shift, i) => {
            return (
                <tr key={i}>
                    <td>{SignUp.formatTime(shift.shift.hourStart)}</td>
                    <td>{shift.available} available</td>
                    <td>{this.getButton(shift)}</td>
                </tr>
            )
        })
    }

    fetchShifts = async () => {
        const response = await fetch("/api/shifts")
        const shifts = await response.json()

        this.setState({
            thursdayShifts: shifts.filter(shift => shift.shift.day === "Thursday"),
            fridayShifts: shifts.filter(shift => shift.shift.day === "Friday")
        })
    }

    fetchAssignmentsWithShifts = async () => {
        const {email} = this.props

        if (email) {
            const encoded = encodeURIComponent(email)
            const response = await fetch(`/api/assignment?email=${encoded}`)
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

        const {name, email} = this.props

        if (name !== "" && email !== "") {
            await fetch("/api/assignment", {
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

        await fetch(`/api/assignment/${primaryId}`, {method: "DELETE"})
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

export default SignUp;
