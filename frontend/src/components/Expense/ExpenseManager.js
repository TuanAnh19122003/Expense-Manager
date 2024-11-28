import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseItem from './ExpenseItem';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);  // Thêm state loading để quản lý trạng thái tải dữ liệu
  const [error, setError] = useState(null);  // Thêm state để lưu thông báo lỗi
  const navigate = useNavigate();  // Khai báo useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');  // Lấy token từ localStorage

    if (!token) {
      navigate('/login');  // Nếu không có token, chuyển hướng người dùng đến trang login
      return;
    }

    try {
      // Giải mã token và lấy thông tin người dùng từ token
      const decoded = jwtDecode(token);
      setUsername(decoded.username);  // Lưu tên người dùng vào state từ token

      // Lấy chi tiêu từ backend
      axios.get('http://localhost:3000/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Gửi token trong header Authorization
        }
      })
        .then(response => {
          setExpenses(response.data.expenses || []);  // Kiểm tra dữ liệu chi tiêu
          setLoading(false);  // Đặt loading = false khi lấy dữ liệu thành công
        })
        .catch(error => {
          setError('Không thể lấy dữ liệu chi tiêu.');  // Gửi thông báo lỗi nếu không lấy được chi tiêu
          setLoading(false);  // Đặt loading = false khi có lỗi
        });
    } catch (error) {
      console.error('Token không hợp lệ:', error);
      navigate('/login');  // Nếu token không hợp lệ, chuyển hướng đến trang login
    }
  }, [navigate]);  // Thêm navigate vào dependency array

  // Group chi tiêu theo category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const categoryName = expense.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(expense);
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem('token');  // Xóa token khi đăng xuất
    navigate('/login');  // Dùng navigate thay vì history.push để chuyển hướng
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h1 className="text-center">Expense Manager</h1>
        <div>
          <span className="mr-3">Chào, {username}</span>
          <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>

      {loading && <div className="text-center">Đang tải dữ liệu...</div>}  {/* Thêm phần hiển thị khi đang tải */}
      
      {error && <div className="alert alert-danger">{error}</div>}  {/* Hiển thị thông báo lỗi nếu có */}

      <div className="row">
        {Object.keys(groupedExpenses).length > 0 ? (  // Kiểm tra xem có chi tiêu hay không
          Object.keys(groupedExpenses).map((categoryName) => (
            <div key={categoryName} className="col-md-4 mb-6">
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="text-center">{categoryName}</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {groupedExpenses[categoryName].map((expense) => (
                      <ExpenseItem key={expense._id} expense={expense} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Chưa có chi tiêu nào.</p>  {/* Hiển thị thông báo nếu không có chi tiêu */}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-success">Thêm Chi Tiêu</button>
      </div>
    </div>
  );
};

export default ExpenseManager;
