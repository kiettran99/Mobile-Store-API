const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/api/user');
const productRouter = require('./routers/api/product');
const authRouter = require('./routers/api/auth');
const errorHandler = require('./middleware/error-handler');
const PORT = process.env.PORT;
// @ts-ignore
global.XMLHttpRequest = require('xhr2');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Global error handler
app.use(errorHandler);

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);

//Start nodejs server
const server = app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

//Settings 8 minutes to automatically shut down server.
setTimeout(() => {
  server.close()
}, 8 * 1000 * 60);
