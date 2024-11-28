const mongoose = require('mongoose');

// Định nghĩa mô hình người dùng
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });


userSchema.methods.comparePassword = function(password) {
  return this.password === password;
};

module.exports = mongoose.model('User', userSchema);
