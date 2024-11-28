import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseItem from './ExpenseItem';
import { useNavigate } from 'react-router-dom';  // Sử dụng useNavigate thay vì useHistory

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();  // Khai báo useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');  // Lấy token từ localStorage

    // Lấy thông tin người dùng từ token
    axios.get('http://localhost:3000/auth/login', {
      headers: {
        'Authorization': token,
      }
    })
      .then(response => {
        setUsername(response.data.username);  // Lưu tên người dùng vào state
      })
      .catch(error => console.error('Error fetching user:', error));

    // Lấy chi tiêu từ backend
    axios.get('http://localhost:3000/expenses', {
      headers: {
        'Authorization': token,
      }
    })
      .then(response => setExpenses(response.data.expenses))
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

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

      <div className="row">
        {Object.keys(groupedExpenses).map((categoryName) => (
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
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-success">Thêm Chi Tiêu</button>
      </div>
    </div>
  );
};

export default ExpenseManager;
