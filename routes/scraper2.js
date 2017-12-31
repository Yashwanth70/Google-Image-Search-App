// var request = require('request');
// var fs = require('fs');
var Jimp = require("jimp");
var async = require("async");
var base64Img = require('base64-img');

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
							console.log(result);
							async.each(result, function (item, callback) {
							var current_url = item.url;

							}, function (err) {
							console.log('All done');
							res.redirect('images?'+keyword.toUpperCase());
							});							
					})

			.catch(function(err) {
						console.log('err', err);
			});
		}
