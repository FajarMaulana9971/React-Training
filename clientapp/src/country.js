import { useEffect, useState } from "react";

function Country() {
  const url = "http://localhost:9000/v1/country";
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdateCountry, setSelectedUpdateCountry] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        alert("Error when fetching data: " + error);
      });
  }, []);

  const handleCreate = (newCountry) => {
    setCountries([...countries, newCountry]);
    setShowCreateModal(false);
  };

  const handleUpdate = (updatedCountry) => {
    const updatedCountries = countries.map((country) =>
      country.id === updatedCountry.id ? updatedCountry : country
    );
    setCountries(updatedCountries);
    setShowUpdateModal(false);
  };

  const handleDelete = (id) => {
    fetch(url + "/" + id, {
      method: "DELETE",
    })
      .then(() => {
        const updatedCountries = countries.filter(
          (country) => country.id !== id
        );
        setCountries(updatedCountries);
      })
      .catch((error) => {
        alert("Error when deleting country: " + error);
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">List Of Country</h1>

      <div className="mb-3 d-flex justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Country
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Name</th>
            <th>Region</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={country.id} className="text-center">
              <td>{index + 1}</td>
              <td>{country.name}</td>
              <td>{country.region.name}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => setSelectedCountry(country)}
                >
                  <span className="material-symbols-outlined">info</span>
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setSelectedUpdateCountry(country);
                    setShowUpdateModal(true);
                  }}
                >
                  <span className="material-symbols-outlined">update</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(country.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <CreateCountry
          onCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showUpdateModal && selectedUpdateCountry && (
        <UpdateCountry
          onUpdate={handleUpdate}
          onClose={() => setShowUpdateModal(false)}
          country={selectedUpdateCountry}
        />
      )}

      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}

function CreateCountry({ onCreate, onClose }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9000/v1/region")
      .then((response) => response.json())
      .then((data) => {
        setRegions(data);
      })
      .catch((error) => {
        alert("Error when fetching regions: " + error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCountry = { name, code, regionId: parseInt(regionId) };

    fetch("http://localhost:9000/v1/country/dto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCountry),
    })
      .then((response) => response.json())
      .then((data) => {
        onCreate(data);
        setName("");
        setCode("");
        setRegionId("");
      })
      .catch((error) => {
        alert("Error when creating a country: " + error);
      });
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", paddingRight: "15px" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Country</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label">
                  Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  Region
                </label>
                <select
                  className="form-select"
                  id="region"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountryDetail({ country, onClose }) {
  return (
    <div
      className="modal fade show"
      style={{ display: "block", paddingRight: "15px" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Country Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              <strong>ID:</strong> {country.id}
            </p>
            <p>
              <strong>Name:</strong> {country.name}
            </p>
            <p>
              <strong>Code:</strong> {country.code}
            </p>
            <p>
              <strong>Region:</strong> {country.region && country.region.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateCountry({ onUpdate, onClose, country }) {
  const [code, setCode] = useState(country.code || "");
  const [name, setName] = useState(country.name || "");
  const [regionId, setRegionId] = useState(country.regionId || "");
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9000/v1/region")
      .then((response) => response.json())
      .then((data) => {
        setRegions(data);
      })
      .catch((error) => {
        alert("Error when fetching regions: " + error);
      });
  }, []);

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const updatedCountry = { name, code, regionId: parseInt(regionId) };

    fetch(`http://localhost:9000/v1/country/${country.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCountry),
    })
      .then((response) => response.json())
      .then((data) => {
        onUpdate(data);
      })
      .catch((error) => {
        alert("Error when updating a country: " + error);
      });
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", paddingRight: "15px" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Country</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label">
                  Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  Region
                </label>
                <select
                  className="form-select"
                  id="region"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Country;
