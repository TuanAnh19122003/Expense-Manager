const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User'); // Đảm bảo rằng đường dẫn đúng đến mô hình User

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/expenseManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Kết nối MongoDB thành công');
  })
  .catch((error) => {
    console.log('Lỗi kết nối MongoDB:', error);
  });

// Tạo giao diện readline để nhận đầu vào từ người dùng
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hàm nhập thông tin người dùng
const createUserFromInput = async () => {
  rl.question('Nhập tên người dùng: ', async (username) => {
    rl.question('Nhập email: ', async (email) => {
      rl.question('Nhập mật khẩu: ', async (password) => {
        const user = new User({
          username,
          email,
          password
        });

        // Lưu người dùng vào cơ sở dữ liệu
        try {
          await user.save();
          console.log('Người dùng mẫu đã được thêm vào cơ sở dữ liệu!');
        } catch (error) {
          console.log('Lỗi khi thêm người dùng:', error);
        }

        // Đóng kết nối và giao diện readline
        rl.close();
        mongoose.connection.close();
      });
    });
  });
};

// Gọi hàm tạo người dùng từ input
createUserFromInput();
