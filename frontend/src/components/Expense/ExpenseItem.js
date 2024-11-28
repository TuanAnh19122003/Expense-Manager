import React from 'react';

const ExpenseItem = ({ expense }) => {
  // Định dạng ngày tháng
  const formattedDate = new Date(expense.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5>Mô tả: {expense.description}</h5>
            <p>Số tiền đã chi: {expense.amount} VND</p>
            <p>Ngày chi: {formattedDate}</p>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between p-3">
        <button className="btn btn-warning btn-sm">Sửa</button>
        <button className="btn btn-danger btn-sm">Xóa</button>
      </div>
    </div>
  );
};

export default ExpenseItem;
