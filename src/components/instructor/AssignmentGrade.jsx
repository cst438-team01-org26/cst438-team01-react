import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();

  const fetchData = async () => {
    setGrades([]);
    setMessage('');

    try {
      const response = await fetch(
          `${GRADEBOOK_URL}/assignments/${assignment.id}/grades`,
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
          setMessage('No grades found for this assignment.');
        } else {
          setGrades(data);
        }
      } else {
        const rc = await response.json();
        setMessage('Error: ' + rc.message);
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  const editOpen = () => {
    fetchData();
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const updateScore = (index, value) => {
    const updated = [...grades];
    updated[index].score = value === '' ? null : Number(value);
    setGrades(updated);
  };

  const saveData = async () => {
    setMessage('');

    try {
      const response = await fetch(
          `${GRADEBOOK_URL}/assignments/${assignment.id}/grades`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('jwt'),
            },
            body: JSON.stringify(grades),
          }
      );

      if (response.ok) {
        setMessage('Grades saved successfully.');
      } else {
        const rc = await response.text();
        setMessage('Error: ' + rc);
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
      <>
        <button id="gradeButton" onClick={editOpen}>Grade</button>

        <dialog ref={dialogRef}>
          <h3>Assignment Grades</h3>

          <Messages message={message} />

          {grades.length > 0 && (
              <table className="Center">
                <thead>
                <tr>
                  {headers.map((h, i) => (
                      <th key={i}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {grades.map((g, index) => (
                    <tr key={g.gradeId}>
                      <td>{g.gradeId}</td>
                      <td>{g.studentName}</td>
                      <td>{g.studentEmail}</td>
                      <td>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={g.score ?? ''}
                            onChange={(e) => updateScore(index, e.target.value)}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}

          <br />
          <button onClick={saveData}>Save</button>
          <button onClick={editClose}>Close</button>
        </dialog>
      </>
  );
}

export default AssignmentGrade;