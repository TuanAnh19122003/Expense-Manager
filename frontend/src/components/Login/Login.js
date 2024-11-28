import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // chỉ cần import useNavigate
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // sử dụng useNavigate thay vì useHistory

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      console.log("Login successful:", response.data); // Log response từ server
      localStorage.setItem('token', response.data.token);
      navigate('/ExpenseManager');
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message); // Log lỗi từ server
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };  

  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <div className="header text-center mb-4">
          <h2 className="text-primary">Đăng nhập</h2>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <div className="input mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary w-45">Đăng nhập</button>
              <button type="button" className="btn btn-secondary w-45" onClick={handleRegister}>Đăng ký</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
