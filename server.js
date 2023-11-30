const fs = require('fs');
const app = require('./app');
const Job = require('./models/jobModel');
const verifyId = require('./models/verifyIdModel');
const connectDB = require('./db');
require('dotenv').config({ path: './config.env' });

connectDB;


const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server is connected at port ${port}`);
});


const recommended = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/jobs.json`, 'utf-8'));


const importData = async () => {
	try {
		await Job.create(recommended, { validateBeforeSave: false } );
		console.log('Data successfully loaded!');
	} catch (err) {
		console.log(err.message);
	}
};


const deleteData = async () => {
	try {
		await Job.deleteMany();
		console.log('Data successfully deleted!');
	} catch (err) {
		console.log(err.message);
	}
};

// console.log(process.argv)

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
};