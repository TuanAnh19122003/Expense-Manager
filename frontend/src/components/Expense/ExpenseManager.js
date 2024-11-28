import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseItem from './ExpenseItem'; // Giả sử ExpenseItem đã được tạo sẵn

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);

  // Lấy tất cả chi tiêu từ backend
  useEffect(() => {
    axios.get('http://localhost:3000/expenses')
      .then(response => setExpenses(response.data.expenses))
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  // Nhóm các chi tiêu theo tên category
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const categoryName = expense.category.name; // Lấy tên category từ expense
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(expense);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <h1 className="text-center">Expense Manager</h1>
      
      <div className="row">
        {Object.keys(groupedExpenses).map((categoryName) => (
          <div key={categoryName} className="col-md-4 mb-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="text-center">{categoryName}</h5> {/* Hiển thị tên category */}
              </div>
              <div className="card-body">
                <div className="list-group">
                  {groupedExpenses[categoryName].map((expense) => (
                    <div key={expense._id} className="list-group">
                      <ExpenseItem expense={expense} />
                    </div>
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
