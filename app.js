var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var app = express();

//Custom Modules below
var config = require('./config/config.js');
var schema_config = require('./config/schema.js');
var scraper = require('./routes/scraper.js');


var mongoose = config.myConfig();
var image_record,x = schema_config.mySchema(mongoose);
var base64Img = require('base64-img');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
// app.use('/users', users);

app.get('',function(req,res){
	res.sendFile(__dirname+ '/views/welcome.html');
})

app.get('/history',function(req,res){
	res.sendFile(__dirname+ '/views/history.html');
})
//RETURNS THE LIST OF KEYWORDS
app.all('/keywordlist',function(req,res){

		var find_keyword_all = mongoose.model('image_model', image_record);
		var list_all = [];
		find_keyword_all.find({}, function (err, find_keyword_all){

			if (err) return handleError(err);
			for (var i=0;i<find_keyword_all.length;i++)
			{
				list_all.push(find_keyword_all[i].keyword_name)	
			}
			res.send(list_all);
	}
)})

app.all('/images?:name',function(req,res){
	res.sendFile(__dirname+ '/views/images.html');
})

//SENDS THE LOCATION ON IMAGES ON REQUEST
app.all('/getimages/:name',function(req,res){

		var keyword_identify = req.params.name;
		var find_keyword_location = mongoose.model('image_model', image_record);
		find_keyword_location.find({keyword_name: keyword_identify }, function (err, find_keyword_location){
			if (err) return handleError(err);
			console.log(find_keyword_location[0].keyword_location);
			res.send(find_keyword_location[0].keyword_location);		
	})
})

//CHECKS IF KEYWORD EXISTS OR NOT
app.post('/main', function(req, res){
		var keyword = req.body.keyword
		console.log(keyword)
		var find_keyword_instance = mongoose.model('image_model', image_record);
		find_keyword_instance.find({keyword_name: keyword.toUpperCase() }, function (err, find_keyword_instance){
		if (err) return handleError(err);

		if (find_keyword_instance.length > 0) {
			console.log('Value already in DB');
			res.redirect('images?'+keyword.toUpperCase());
		}
		else{
				var instance_insert_keyword = mongoose.model('image_model', image_record);
				//PUSHING KEYWORD TO DB
				instance_insert_keyword.create({ keyword_name: keyword.toUpperCase() }, function (err, instance_insert_keyword){
				if (err) return handleError(err);
				console.log('saved');
				});

				var result_instance = mongoose.model('image_model', image_record);
				var query = result_instance.find().lean();
				query.select('keyword_name');
				query.exec(function (err, result) {
				if (err) return handleError(err);
				//SCRAPING HERE
				var db_instance = mongoose.model('image_model', image_record );
				scraper.myScraper(keyword,db_instance,res);
			})
		}})
	})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
