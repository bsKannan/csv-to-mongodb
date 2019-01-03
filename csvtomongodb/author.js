var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  
		firstName: {
			type: String,
			required: true
		},
		lastName:  {
			type: String,
			required: true
		},
	
	biography: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

var Author = mongoose.model('Author', authorSchema);

module.exports = Author;