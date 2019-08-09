import React from 'react';

class View extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thursdayShifts: [],
            fridayShifts: [],
            assignmentsWithShifts: []
        }
    }

    componentDidMount() {
        this.fetchAssignmentsWithShifts()
    }

    render() {
        const {thursdayShifts, fridayShifts} = this.state

        console.log(fridayShifts)

        return (
            <div className="page">
                <React.Fragment>
                    <h2 className="noneLeft">your shifts</h2>
                    <h1>Thursday August 15th</h1>

                    {thursdayShifts.length > 0 ?
                        <table>
                            <tbody>
                            {this.getRows(thursdayShifts)}
                            </tbody>
                        </table>
                        : <h2>you don't have any shifts on Thursday</h2>
                    }


                    <h1>Friday August 16th</h1>

                    {fridayShifts.length > 0 ?
                        <table>
                            <tbody>
                            {this.getRows(fridayShifts)}
                            </tbody>
                        </table>
                        : <h2>you don't have any shifts on Friday</h2>
                    }

                </React.Fragment>
            </div>
        )
    }

    getRows(shifts) {

        shifts.sort((a, b) => (a.shift.hourStart > b.shift.hourStart) ? 1 : -1)

        return shifts.map((shift, i) => {
            return (
                <React.Fragment>
                    <tr key={i}>
                        <td className="noneLeft">{View.formatTime(shift.shift.hourStart)}</td>
                        <td className="noneLeft">location TBD</td>
                    </tr>
                </React.Fragment>
            )
        })
    }

    fetchAssignmentsWithShifts = async () => {
        const {email} = this.props

        if (email) {
            const encoded = encodeURIComponent(email)
            const response = await fetch(`/api/assignment?email=${encoded}`)
            const assignments = await response.json()
            this.setState({
                thursdayShifts: assignments.filter(assignment => assignment.shift.day === "Thursday"),
                fridayShifts: assignments.filter(assignment => assignment.shift.day === "Friday")
            })
        }
    }


    static formatTime(hourStart) {
        let hourEnd = hourStart + 1

        if (hourStart > 12) {
            hourStart = `${hourStart - 12}:00PM`
         } else if (hourStart < 12) {
            hourStart = `${hourStart}:00AM`
        } else if (hourStart = 12) {
            hourStart = `${hourStart}:00PM`
        }

        if (hourEnd > 12) {
            hourEnd = `${hourEnd - 12}:00PM`
        } else if (hourEnd < 12) {
            hourEnd = `${hourEnd}:00AM`
        }else if (hourEnd = 12) {
            hourEnd = `${hourEnd}:00PM`
        }

        return `${hourStart} - ${hourEnd}`
    }
}

export default View;
