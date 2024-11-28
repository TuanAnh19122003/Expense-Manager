import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // sử dụng useNavigate thay vì useHistory
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // sử dụng useNavigate thay vì useHistory

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username, email, password });
      console.log('Registration successful:', response.data);
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      setTimeout(() => {
        navigate('/login'); // Sử dụng navigate để điều hướng đến trang đăng nhập
      }, 2000);
    } catch (err) {
      setError('Đã có lỗi xảy ra trong quá trình đăng ký');
    }
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
                  placeholder="Username"
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
            <div className="input mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary w-45">Đăng ký</button>
              <button type="button" className="btn btn-secondary w-45" onClick={() => navigate('/login')}>Đăng nhập</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
