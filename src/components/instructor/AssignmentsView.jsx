import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;


  const fetchAssignments = async () => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("jwt"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, []);

  const deleteAssignment = async (id) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': sessionStorage.getItem("jwt"),
        },
      });

      if (response.ok) {
        fetchAssignments();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  const onDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Do you really want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAssignment(id),
        },
        {
          label: 'No',
        },
      ],
    });
  }





  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
      <div>
        <h3>Assignments for {courseId} {secId}</h3>
        <Messages response={message} />

        <table className="Center">
          <thead>
          <tr>
            {headers.map((h, idx) => (
                <th key={idx}>{h}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.title}</td>
                <td>{a.dueDate}</td>
                <td><AssignmentUpdate editAssignment={a} onClose={fetchAssignments} /></td>
                <td><AssignmentGrade assignment={a} /></td>
                <td><button onClick={() => onDelete(a.id)}>Delete</button></td>
              </tr>
          ))}
          </tbody>
        </table>

        <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
      </div>
  );
}

export default AssignmentsView;
