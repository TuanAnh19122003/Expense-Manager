import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username, email, password });
      console.log("Register successful:", response.data); // Log response từ server
      localStorage.setItem('token', response.data.token); // Lưu token vào localStorage nếu đăng ký thành công
      navigate('/ExpenseManager'); // Điều hướng đến trang ExpenseManager sau khi đăng ký thành công
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError('Đã xảy ra lỗi khi đăng ký');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <div className="header text-center mb-4">
          <h2 className="text-primary">Đăng ký</h2>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleRegister}>
          <div className="inputs">
            <div className="input mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên người dùng"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
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
              <button type="submit" className="btn btn-primary w-45">Đăng ký</button>
              <button type="button" className="btn btn-secondary w-45" onClick={handleLogin}>Đã có tài khoản? Đăng nhập</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
