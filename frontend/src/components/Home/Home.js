import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleLoginRedirect = () => {
    navigate('/login'); // Điều hướng đến trang login
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <div className="header text-center mb-4">
          <h2 className="text-primary">Chào mừng đến với ứng dụng!</h2>
          <div className="underline"></div>
        </div>
        <div className="text-center">
          <p>Hãy đăng nhập để tiếp tục.</p>
          <button onClick={handleLoginRedirect} className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
