const express = require('express');
const authFunction = require('./DB/auth.js');
const connectDB = require('./DB/index.js');
const app = express();

require('dotenv').config();
connectDB();

app.use(express.json({ extended: false }));


app.use('/api/auth', require('./Routers/userAuthRouter.js'));
app.use('/api/tasks', authFunction.needAuth, require('./Routers/taskRouter.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
