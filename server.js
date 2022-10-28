require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const adminRouter = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3700;
const mongoString = process.env.DATABASE_URL;

app.use(express.json());
app.use(
    cors({
        origin: '*',
    })
);

mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => console.log('db err: ', error));
db.once('open', () => console.log('mongoose connected'));

app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
