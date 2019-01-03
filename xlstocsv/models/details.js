var mongoose = require('mongoose');

// var schema = mongoose.Schema;

var detailSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sales: {
        type:String
    },
    segment: {
        type:String
    },
    country: {
        type:String
    },
    product: {
        type:String
    },
    units_sold: {
        type:String
    },
    manufacturing_price: {
        type:String
    },
    sale_price: {
        type:String
    },
    gross_sales: {
        type:String
    }
  
})


module.exports = mongoose.model('detail',detailSchema)