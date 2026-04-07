import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const Transcript = () => {
  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <>
      <h3>Transcript</h3>
      <Messages response={message} />
      <table className="Center">
        <thead>
          <tr>
            <th>Year</th>
            <th>Semester</th>
            <th>Course ID</th>
            <th>Section</th>
            <th>Title</th>
            <th>Credits</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, idx) => (
            <tr key={idx}>
              <td>{c.year}</td>
              <td>{c.semester}</td>
              <td>{c.courseId}</td>
              <td>{c.sectionId}</td>
              <td>{c.title}</td>
              <td>{c.credits}</td>
              <td>{c.grade || 'IP'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Transcript;