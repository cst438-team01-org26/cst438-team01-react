import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const CourseEnroll = () => {
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => { fetchSections(); }, []);

  const onEnroll = (secNo) => {
    confirmAlert({
      title: 'Confirm Enrollment',
      message: `Do you want to enroll in section ${secNo}?`,
      buttons: [
        { label: 'Yes', onClick: () => doEnroll(secNo) },
        { label: 'No' }
      ]
    });
  }

  const doEnroll = async (secNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/sections/${secNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });
      if (response.ok) {
        setMessage("Successfully enrolled!");
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <table className="Center">
        <thead>
          <tr>
            <th>Section No</th>
            <th>Year</th>
            <th>Semester</th>
            <th>Course ID</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.year}</td>
              <td>{s.semester}</td>
              <td>{s.courseId}</td>
              <td>{s.title}</td>
              <td>{s.instructorName}</td>
              <td>
                <button onClick={() => onEnroll(s.secNo)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseEnroll;