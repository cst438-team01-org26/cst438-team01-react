import { useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const AssignmentsStudentView = () => {

  const [message, setMessage] = useState('');
  const [assignments, setAssignments] = useState([]);

  const fetchData = async ({ year, semester }) => {
    setAssignments([]); // Clear previous results
    setMessage('');
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setMessage("No assignments found for this term.");
        } else {
          setAssignments(data);
        }
      } else {
        const rc = await response.json();
        setMessage("Error: " + rc.message);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  }

  const headers = ['Course', 'Assignment Name', 'Due Date', 'Score'];

  return (
    <>
      <div className="App">
        <h3>Assignments</h3>
        <Messages response={message} />

        <SelectTerm buttonText="Get Assignments" onClick={fetchData} />

        {assignments.length > 0 && (
          <table className="Center">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.courseId}</td>
                  <td>{a.assignmentName}</td>
                  <td>{a.dueDate}</td>
                  <td>{a.score !== null ? a.score : 'Not Graded'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default AssignmentsStudentView;