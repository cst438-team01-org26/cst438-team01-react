import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment({ ...assignment, secNo: secNo, title: '', dueDate: '' });
    dialogRef.current.showModal();
  };
  const onChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };
  const saveAssignment = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        dialogRef.current.close();
        onClose();
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
      <>
        <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
        <dialog ref={dialogRef} >
          <h2>Add Assignment</h2>
          <Messages response={message} />
          <input
              type="text"
              name="title"
              value={assignment.title}
              placeholder="title"
              onChange={onChange}
          />
          <input
              type="date"
              name="dueDate"
              value={assignment.dueDate}
              onChange={onChange}
          />
          <button onClick={() => dialogRef.current.close()}>Close</button>
          <button onClick={saveAssignment}>Save</button>
        </dialog>
      </>
  )
}

export default AssignmentAdd;
