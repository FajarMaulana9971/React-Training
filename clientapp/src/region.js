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

function Region() {
  const url = "http://localhost:9000/v1/region";
  const { data: regions, error } = useFetch(url);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showCreateRegionModal, setShowCreateRegionModal] = useState(false);
  const [showUpdateRegionModal, setShowUpdateRegionModal] = useState(false);
  const [selectedUpdateRegion, setSelectedUpdateRegion] = useState(null);
  const [allRegions, setAllRegions] = useState([]);

  useEffect(() => {
    setAllRegions(regions);
  }, [regions]);

  const openCreateRegion = () => {
    setShowCreateRegionModal(true);
  };

  const closeCreateRegion = () => {
    setShowCreateRegionModal(false);
  };

  const handleCreateRegion = (newRegion) => {
    setAllRegions([...allRegions, newRegion]);
  };

  const openDetailRegions = (region) => {
    setSelectedRegion(region);
  };

  const closeDetailRegions = () => {
    setSelectedRegion(null);
  };

  const openUpdateModal = (region) => {
    setSelectedUpdateRegion(region);
    setShowUpdateRegionModal(true);
  };

  const handleUpdateRegion = (updatedRegion) => {
    const updatedRegions = allRegions.map((region) =>
      region.id === updatedRegion.id ? updatedRegion : region
    );
    setAllRegions(updatedRegions);
  };

  const handleDeleteRegion = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedRegions = allRegions.filter((region) => region.id !== id);
      setAllRegions(updatedRegions);
    } catch (error) {
      alert("Error when deleting region: " + error);
      console.error("Error when deleting region:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">List Of Regions</h1>
      {error && (
        <div className="alert alert-danger">
          Error fetching regions: {error.message}
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr className="text-center">
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {allRegions.map((region, index) => (
            <tr key={region.id} className="text-center">
              <td>{index + 1}</td>
              <td>{region.name}</td>
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => openDetailRegions(region)}
                >
                  <span className="material-symbols-outlined">info</span>
                </button>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => openUpdateModal(region)}
                >
                  <span className="material-symbols-outlined">update</span>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteRegion(region.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-primary d-flex justify-content-end mb-3"
        onClick={openCreateRegion}
      >
        Create New Region
      </button>

      {showCreateRegionModal && (
        <CreateRegion
          onCreate={handleCreateRegion}
          onClose={closeCreateRegion}
        />
      )}

      {selectedRegion && (
        <RegionDetails region={selectedRegion} onClose={closeDetailRegions} />
      )}

      {selectedUpdateRegion && showUpdateRegionModal && (
        <UpdateRegion
          onUpdate={handleUpdateRegion}
          onClose={() => setShowUpdateRegionModal(false)}
          region={selectedUpdateRegion}
        />
      )}
    </div>
  );
}

function RegionDetails({ region, onClose }) {
  const { data: countries, error } = useFetch(
    "http://localhost:9000/v1/country"
  );
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    if (countries.length > 0 && region) {
      const filtered = countries.filter(
        (c) => c.region.id === region.id || c.regionId === region.id
      );
      setFilteredCountries(filtered);
    }
  }, [countries, region]);

  return (
    <div className="modal fade show d-block" role="dialog" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Region Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <h5>{region.name}</h5>
            <p>ID: {region.id}</p>
            {error && (
              <div className="alert alert-danger">
                Error fetching countries: {error.message}
              </div>
            )}
            <ul className="list-group">
              {filteredCountries.map((country) => (
                <li key={country.id} className="list-group-item">
                  {country.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateRegion({ onCreate, onClose }) {
  const [name, setName] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    const newRegion = { name };

    try {
      const response = await fetch("http://localhost:9000/v1/region", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegion),
      });
      const data = await response.json();
      onCreate(data);
      setName("");
    } catch (error) {
      alert("Error when creating region: " + error);
      console.error("Error when creating region:", error);
    }
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
            <h5 className="modal-title">Create New Region</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label htmlFor="regionName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="regionName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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

function UpdateRegion({ onUpdate, onClose, region }) {
  const [name, setName] = useState(region.name);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedRegion = { name };

    try {
      const response = await fetch(
        `http://localhost:9000/v1/region/${region.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRegion),
        }
      );
      const data = await response.json();
      onUpdate(data);
      onClose();
    } catch (error) {
      alert("Error when updating region: " + error);
      console.error("Error when updating region:", error);
    }
  };

  return (
    <div className="modal fade show d-block" role="dialog" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Region</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="updateName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="updateName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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

export default Region;
