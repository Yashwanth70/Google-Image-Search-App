exports.myConfig = function(){ 

		var mongoose = require('mongoose');
		// var mongoDB = 'mongodb://localhost/27017'; //Set up default mongoose connection
		var mongoDB = "mongodb://admin:admin@ds133597.mlab.com:33597/darwin_yash";
		mongoose.connect(mongoDB, {
		  useMongoClient: true
		});
		mongoose.Promise = global.Promise;
		var db = mongoose.connection; //Get the default connection
		db.on('error', console.error.bind(console, 'MongoDB connection error:'));	//Bind connection to error event (to get notification of connection errors)
   		return mongoose;
};