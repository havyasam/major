import React from "react";
import { useNavigate } from "react-router-dom";
import './home.css'
import img1 from '../Doctor.png'
import img2 from '../Image2.png'

function HomePage() {
  const navigate = useNavigate();

  return (
    
    <div className="Home">
      <img className="image1" src={img1} alt="Logo" />
      <img className="image2" src={img2} alt="Logo" />
      <h1 className="heading">Choose a Prediction</h1>
      <button className="homeButton" onClick={() => navigate("/cardio")}>Cardio</button>
      <button className="homeButton" onClick={() => navigate("/diabetes")}>Diabetes</button>
      <button className="homeButton" onClick={() => navigate("/kidney")}>Kidney</button>
    </div>
  );
}
export default HomePage
