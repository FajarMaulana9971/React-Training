import React, { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
};

function Employee() {
  const url = "http://localhost:9000/v1/employee";
  const { data: employees, error } = useFetch(url);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const openEmployeeDetail = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  const closeEmployeeDetail = () => {
    setSelectedEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value
    }));
  };

  const handleSaveEmployee = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const id = isEditing ? `/${selectedEmployee.id}` : "";
      const response = await fetch(`${url}${id}`, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const updatedEmployee = await response.json();
      const updatedEmployees = isEditing
          ? employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
          : [...employees, updatedEmployee];

      setSelectedEmployee(null);
      setNewEmployee({ name: "", email: "", phone: "" });
      setIsEditing(false);
    } catch (error) {
      alert("Error saving employee: " + error);
      console.error("Error saving employee:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone
    });
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedEmployees = employees.filter((employee) => employee.id !== id);
      setSelectedEmployee(null);
    } catch (error) {
      alert("Error when deleting employee: " + error);
      console.error("Error when deleting employee:", error);
    }
  };

  return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">List of Employees</h1>
        {error && (
            <div className="alert alert-danger">
              Error fetching employees: {error.message}
            </div>
        )}
        <table className="table table-striped">
          <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {employees.map((employee, index) => (
              <tr key={employee.id} className="text-center">
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => openEmployeeDetail(employee)}
                  >
                    <span className="material-symbols-outlined">info</span>
                  </button>
                  <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditEmployee(employee)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="mt-4">
          <h3>{isEditing ? "Edit Employee" : "Add New Employee"}</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={handleInputChange}
              />
            </div>
            <button type="button" className="btn btn-success" onClick={handleSaveEmployee}>
              {isEditing ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>
  );
}

export default Employee;
