const fs = require('fs');
const app = require('./app');
const findJobs = require('./models/findJobModel');
const verifyId = require('./models/verifyIdModel');
const connectDB = require('./db');
require('dotenv').config({ path: './config.env' });


const port = process.env.PORT || 8000;
connectDB;

app.listen(port, () => {
	console.log(`App running on port ${port} ✈🛬✈`);
});


const recommended = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/userIdCard.json`, 'utf-8')
);


const importData = async () => {
	try {
		await verifyId.create(recommended, { validateBeforeSave: false });
		console.log('Data successfully loaded!');
	} catch (err) {
		console.log(err.message);
	}
};


const deleteData = async () => {
	try {
		await verifyId.deleteMany();
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
}