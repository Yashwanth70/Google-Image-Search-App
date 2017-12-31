exports.mySchema = function(mongoose){

	var Schema = mongoose.Schema;
	var image_record = new Schema({
	    keyword_name : String,  
	    keyword_location : []
	});
	var db_instance = mongoose.model('image_model', image_record ); 
	return image_record,db_instance;
}