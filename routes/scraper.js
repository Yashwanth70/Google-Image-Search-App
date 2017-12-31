// var request = require('request');
// var fs = require('fs');
var Jimp = require("jimp");
var async = require("async");

var i=0;

exports.myScraper = function(keyword,db_instance,res){
	var count = 0 ;
	var Scraper = require ('images-scraper'),
	google = new Scraper.Google();

			google.list({
				keyword: keyword,
				num: 15,
				detail: true,
				nightmare: {
					show: false
				}
			})
			.then(function (result) {
							async.each(result, function (item, callback) {
							var current_url = item.url;
							var loc_save_name = keyword + "-" + i + ".png";	
							db_instance.where('keyword_name', keyword.toUpperCase()).update({$push: {keyword_location: loc_save_name}}, function (err, count) {}); //PUSHING TO DB
							Jimp.read(current_url, function (err, image) {
									console.log('Working on an image');
								    // if (err) throw err;
								    try{
								    image.quality(30)                 // COMPRESSING IMAGE
								    image.greyscale()  				//GREYSCALING IMAGE
								    image.write('./images/'+loc_save_name);			//SAVING IMAGE
								    throw 'myException';
									}
									catch(e){
										console.log('error incurred'+ e);
									}
								finally{
										//AFTER ALL FILES ARE DOWNLOADED, REDIRECT TO THAT PAGE
								        callback();
								     }
								 })
								i+=1;
							}, function (err) {
							console.log('All done');
							res.redirect('images?'+keyword.toUpperCase());
							});							
					})

			.catch(function(err) {
						console.log('err', err);
			});
		}
