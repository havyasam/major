import React, { useState, useEffect } from "react";

const KidneyPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    rbc: "",
    pc: "",
    pcc: "",
    ba: "",
    bu: "",
    pot: "",
    hemo: "",
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
        const response = await fetch("http://127.0.0.1:5000/accuracy/kidney");
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
      const response = await fetch("http://127.0.0.1:5000/predict/kidney", {
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
      <h2>Kidney Disease Prediction</h2>
      {error && <p className="error">{error}</p>}
      {/* {accuracy && (
        <div className="accuracy">
          <h3>Model Accuracy</h3>
          <p>
            <strong>SVM Accuracy:</strong> {accuracy["SVM Accuracy"]}%<br />
            <strong>Random Forest Accuracy:</strong> {accuracy["Random Forest Accuracy"]}%
          </p>
        </div>
      )} */}
      <form onSubmit={handleSubmit} className={isModalOpen ? "blur" : ""}>
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-group">
            <label>{field}</label>
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
                  <strong>Random Forest Prediction (%):</strong> {prediction["Random Forest Prediction (%)"]}%
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add CSS */}
      <style jsx>{`
        .form-container {
          padding: 20px;
        }
        .accuracy {
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
        }
        .blur input {
          filter: blur(5px);
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          width: 300px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: slide-down 0.5s ease;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          background: none;
          border: none;
          color: #333;
        }
        .close-button:hover {
          color: red;
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default KidneyPage;
