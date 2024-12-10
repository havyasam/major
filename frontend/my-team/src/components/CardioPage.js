import React, { useState, useEffect } from "react";
import "./cardiocss.css";

const CardioPage = () => {
  const [formData, setFormData] = useState({
    gender: "",
    height: "",
    weight: "",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "",
    gluc: "",
    smoke: "",
    alco: "",
    active: "",
    age_years: "",
    bmi: "",
  });

  const [accuracy, setAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/accuracy/cardio");
        if (!response.ok) throw new Error("Failed to fetch accuracy data");
        const data = await response.json();
        setAccuracy(data);
      } catch (err) {
        console.error("Error fetching accuracy:", err);
        setError("Error fetching accuracy data");
      }
    };

    fetchAccuracy();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict/cardio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setPrediction(data);
      setIsModalOpen(true); // Open modal on successful prediction
    } catch (err) {
      console.error("Error:", err);
      setError("Error fetching prediction data");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPrediction(null);
  };

  const getBackgroundColor = () => {
    if (prediction) {
      const svmPrediction = prediction["SVM Prediction (%)"];
      const rfPrediction = prediction["Random Forest Prediction (%)"];
      return svmPrediction > 70 || rfPrediction > 70 ? "red" : "rgb(6, 208, 1)";
    }
    return "white"; // Default background color
  };

  return (
    <div className="form-container">
      <h2>Cardiovascular Disease Prediction</h2>
      {error && <p className="error">{error}</p>}

      {/* Display accuracies */}
      {/* {accuracy && (
        <div className="accuracy-container">
          <h3>Model Accuracies</h3>
          <p>
            <strong>SVM Accuracy:</strong> {accuracy["SVM Accuracy"]}%
          </p>
          <p>
            <strong>Random Forest Accuracy:</strong> {accuracy["Random Forest Accuracy"]}%
          </p>
        </div>
      )} */}

      <form onSubmit={handleSubmit} className={isModalOpen ? "blur" : ""}>
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-group">
            <label>{field.replace(/_/g, " ")}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal" style={{ backgroundColor: getBackgroundColor() }}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h3>Prediction Results</h3>
            {prediction && (
              <>
                <p>
                  <strong>SVM Prediction (%):</strong> {prediction["SVM Prediction (%)"]}%
                </p>
                <p>
                  <strong>Random Forest Prediction (%):</strong>{" "}
                  {prediction["Random Forest Prediction (%)"]}%
                </p>
              </>
            )}
            {/* Display accuracies in modal */}
            {accuracy && (
              <div className="modal-accuracy">
                <p>
                  <strong>SVM Accuracy:</strong> {accuracy["SVM Accuracy"]}%
                </p>
                <p>
                  <strong>Random Forest Accuracy:</strong> {accuracy["Random Forest Accuracy"]} %
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardioPage;
