import "./App.css";
import Country from "./country";
import Region from "./region";
import Employee from "./employee";
import Student from "./student";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 ">
          <a className="navbar-brand" href="#">
            MyApp
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/country">
                  Country
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/region">
                  Region
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employee">
                  Employee
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/student">
                  Student
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/country" element={<Country />} />
            <Route path="/region" element={<Region />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/student" element={<Student />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
