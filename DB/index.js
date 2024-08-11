const mongoose = require('mongoose');

const connectDB = () => { 
    mongoose.connect(process.env.MONGODB_URI) // Глобальное подключение mongoose к MongoDB (как альтернатива есть connect если БД несколько)
    .then(()=>console.log('MongoDB connected...'))
    .catch((err)=>{
        console.error(err.message);
        console.error("Завершаю приложение");
        process.exit(1);
    });
};
module.exports = connectDB;
