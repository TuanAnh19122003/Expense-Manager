const mongoose = require('mongoose');
const readline = require('readline');
const Category = require('./models/Category'); // Đảm bảo đường dẫn đúng đến mô hình Category

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

// Hàm nhập dữ liệu cho category
const createCategoryFromInput = async () => {
  rl.question('Nhập tên danh mục: ', async (name) => {
    // Tạo một đối tượng Category mới
    const category = new Category({
      name
    });

    // Lưu category vào cơ sở dữ liệu
    try {
      await category.save();
      console.log('Danh mục đã được thêm vào cơ sở dữ liệu!');
    } catch (error) {
      console.log('Lỗi khi thêm danh mục:', error);
    }

    // Đóng kết nối và giao diện readline
    rl.close();
    mongoose.connection.close();
  });
};

// Gọi hàm tạo category từ input
createCategoryFromInput();
