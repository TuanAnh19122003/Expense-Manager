const mongoose = require('mongoose');
const readline = require('readline');
const Expense = require('./models/Expense'); // Đảm bảo rằng đường dẫn đúng đến mô hình Expense
const Category = require('./models/Category'); // Đảm bảo rằng đường dẫn đúng đến mô hình Category
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

// Hàm nhập thông tin chi tiêu
const createExpenseFromInput = async () => {
  // Lấy danh sách các category từ cơ sở dữ liệu
  const categories = await Category.find();
  const users = await User.find(); // Lấy danh sách người dùng từ cơ sở dữ liệu

  // Hiển thị danh sách category và yêu cầu chọn
  console.log('Danh sách danh mục (Category):');
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name}`);
  });

  // Hiển thị danh sách user và yêu cầu chọn
  console.log('Danh sách người dùng:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username}`);
  });

  rl.question('Chọn danh mục (nhập số thứ tự): ', async (categoryIndex) => {
    rl.question('Chọn người dùng (nhập số thứ tự): ', async (userIndex) => {
      rl.question('Nhập số tiền: ', async (amount) => {
        rl.question('Nhập mô tả: ', async (description) => {
          rl.question('Nhập ngày chi tiêu (yyyy-mm-dd) hoặc nhấn Enter để chọn ngày hiện tại: ', async (date) => {
            // Nếu người dùng không nhập ngày, sử dụng ngày hiện tại
            const expenseDate = date ? new Date(date) : new Date(); // Nếu có nhập ngày, chuyển thành Date, nếu không lấy ngày hiện tại

            // Tạo một đối tượng Expense mới với các giá trị từ người dùng
            const expense = new Expense({
              amount: parseFloat(amount),
              description,
              date: expenseDate, // Sử dụng ngày đã chọn (hoặc ngày hiện tại)
              category: categories[parseInt(categoryIndex) - 1]._id, // Lấy ObjectId của category đã chọn
              user: users[parseInt(userIndex) - 1]._id // Lấy ObjectId của user đã chọn
            });

            // Lưu chi tiêu vào cơ sở dữ liệu
            try {
              await expense.save();
              console.log('Chi tiêu đã được thêm vào cơ sở dữ liệu!');
            } catch (error) {
              console.log('Lỗi khi thêm chi tiêu:', error);
            }

            // Đóng kết nối và giao diện readline
            rl.close();
            mongoose.connection.close();
          });

        });
      });
    });
  });
};

// Gọi hàm tạo chi tiêu từ input
createExpenseFromInput();
