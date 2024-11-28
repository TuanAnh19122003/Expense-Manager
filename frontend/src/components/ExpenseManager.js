import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Lấy danh sách chi tiêu khi component được load
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/expenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExpenses(response.data);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu chi tiêu');
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/expenses', { amount, description, category }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setExpenses([...expenses, response.data]);
      setAmount('');
      setDescription('');
      setCategory('');
    } catch (err) {
      setError('Lỗi khi thêm chi tiêu');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      setError('Lỗi khi xóa chi tiêu');
    }
  };

  return (
    <div className="expense-manager-container">
      <h2>Quản lý Chi tiêu</h2>
      <form onSubmit={handleAddExpense}>
        <div>
          <label>Số tiền</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mô tả</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Danh mục</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Thêm chi tiêu</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>Danh sách Chi tiêu</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            <div>
              <p>{expense.description}</p>
              <p>{expense.amount} VND</p>
              <p>{expense.category}</p>
              <button onClick={() => handleDeleteExpense(expense._id)}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseManager;
