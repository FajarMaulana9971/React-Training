import { useEffect, useState } from "react";
import { format } from "date-fns";

function Student() {
  const url = "http://localhost:9000/v1/student";
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
  const [selectedUpdateStudent, setSelectedUpdateStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      alert("Error fetching students: " + error);
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setShowCreateStudentModal(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setShowUpdateStudentModal(false);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (error) {
      alert("Error deleting student: " + error);
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">List of Students</h1>
      <div className="mb-3 d-flex justify-content-end">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowCreateStudentModal(true)}
        >
          Create New Student
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className="text-center">
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => setSelectedStudent(student)}
                >
                  <span className="material-symbols-outlined">info</span>
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setSelectedUpdateStudent(student);
                    setShowUpdateStudentModal(true);
                  }}
                >
                  <span className="material-symbols-outlined">update</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      {selectedStudent && (
        <DetailStudent
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Create Student Modal */}
      {showCreateStudentModal && (
        <CreateStudent
          onCreate={handleCreateStudent}
          onClose={() => setShowCreateStudentModal(false)}
        />
      )}

      {/* Update Student Modal */}
      {selectedUpdateStudent && showUpdateStudentModal && (
        <UpdateStudent
          url={url}
          onStudentUpdate={handleUpdateStudent}
          onClose={() => setShowUpdateStudentModal(false)}
          student={selectedUpdateStudent}
        />
      )}
    </div>
  );
}

function DetailStudent({ student, onClose }) {
  const formattedDateOfBirth = format(
    new Date(student.dateOfBirth),
    "dd-MM-yyyy"
  );
  const formattedIssueDate = format(
    new Date(student.idCard.issueDate),
    "dd-MM-yyyy"
  );

  return (
    <div className="card shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title">Student Details</h5>
        <button className="btn btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body">
        <p className="mb-2">
          <strong>Name:</strong> {student.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {student.email}
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> {student.phone}
        </p>
        <p className="mb-2">
          <strong>Date of Birth:</strong> {formattedDateOfBirth}
        </p>
        <p className="mb-2">
          <strong>Issue Date:</strong> {formattedIssueDate}
        </p>
      </div>
    </div>
  );
}

function CreateStudent({ onCreate, onClose }) {
  const url = "http://localhost:9000/v1/student";
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDateOfBirth = format(new Date(dateOfBirth), "yyyy-MM-dd");
    const formattedIssueDate = format(new Date(issueDate), "yyyy-MM-dd");
    const idCard = {
      cardNumber: Math.floor(Math.random() * 100000000) + 1,
      issueDate: formattedIssueDate,
    };
    const newStudent = {
      name,
      dateOfBirth: formattedDateOfBirth,
      email,
      phone,
      idCard,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await response.json();
      onCreate(data);
    } catch (error) {
      alert("Error creating student: " + error);
      console.error("Error creating student:", error);
    } finally {
      setName("");
      setDateOfBirth("");
      setEmail("");
      setPhone("");
      setIssueDate("");
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title">Create Student</h5>
        <button className="btn btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="issueDate">Issue Date:</label>
            <input
              type="date"
              className="form-control"
              id="issueDate"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

function UpdateStudent({ url, onStudentUpdate, onClose, student }) {
  const [name, setName] = useState(student.name || "");
  const [email, setEmail] = useState(student.email || "");
  const [phone, setPhone] = useState(student.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth || "");
  const [issueDate, setIssueDate] = useState(student.idCard?.issueDate || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedStudent = {
      name,
      email,
      phone,
      dateOfBirth,
      idCard: {
        cardNumber: student.idCard.cardNumber,
        issueDate: issueDate,
      },
    };

    try {
      const response = await fetch(`${url}/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      const data = await response.json();
      onStudentUpdate(data);
    } catch (error) {
      alert("Error updating student: " + error);
      console.error("Error updating student:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title">Update Student</h5>
        <button className="btn btn-close" onClick={onClose}></button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="issueDate">Issue Date:</label>
            <input
              type="date"
              className="form-control"
              id="issueDate"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Student;
