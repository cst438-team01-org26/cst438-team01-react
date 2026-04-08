import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({ year: '', semester: '' });

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  const onDrop = (enrollmentId) => {
    confirmAlert({
      title: 'Confirm to Drop',
      message: 'Are you sure you want to drop this course?',
      buttons: [
        { label: 'Yes', onClick: () => doDrop(enrollmentId) },
        { label: 'No' }
      ]
    });
  }

  const doDrop = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });
      if (response.ok) {
        setMessage("Course dropped successfully.");
        fetchEnrollments(term.year, term.semester); 
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  const headers = ['Enrollment ID', 'Sec No', 'Course ID', 'Building', 'Room', 'Times', 'Action'];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.secNo}</td>
              <td>{e.courseId}</td>
              <td>{e.building}</td>
              <td>{e.room}</td>
              <td>{e.times}</td>
              <td>
                <button onClick={() => onDrop(e.enrollmentId)}>Drop</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleView;