import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchData = async () => {
    setEnrollments([]);
    setMessage('');

    try {
      const response = await fetch(
          `${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
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
          setMessage('No enrollments found for this section.');
        } else {
          setEnrollments(data);
        }
      } else {
        const rc = await response.json();
        setMessage('Error: ' + rc.message);
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateGrade = (index, value) => {
    const updated = [...enrollments];
    updated[index].grade = value;
    setEnrollments(updated);
  };

  const saveData = async () => {
    setMessage('');
    try {
      const response = await fetch(
          `${GRADEBOOK_URL}/enrollments`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('jwt'),
            },
            body: JSON.stringify(enrollments),
          }
      );

      if (response.ok) {
        setMessage('Final grades saved successfully.');
      } else {
        const rc = await response.text();
        setMessage('Error: ' + rc);
      }
    } catch (err) {
      setMessage('Network error: ' + err.message);
    }
  };

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
      <>
        <div className="App">
          <h3>{courseId}-{secId} Enrollments</h3>

          <Messages response={message} />

          {enrollments.length > 0 && (
              <table className="Center">
                <thead>
                <tr>
                  {headers.map((h, i) => (
                      <th key={i}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e, index) => (
                    <tr key={e.enrollmentId}>
                      <td>{e.enrollmentId}</td>
                      <td>{e.studentId}</td>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>
                        <input
                            type="text"
                            placeholder="A, B+, C-"
                            value={e.grade ?? ''}
                            onChange={(ev) => updateGrade(index, ev.target.value)}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}

          <br />
          <button onClick={saveData} disabled={enrollments.length === 0}>Save All Grades</button>
        </div>
      </>
  );
}

export default EnrollmentsView;