import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './src/routes/auth.routes.js';


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Path specific middleware
app.use('/api/auth', authRouter);
// app.use('/api/todo', todoRouter);

// Routes


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});