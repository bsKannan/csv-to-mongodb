var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var detail = require('./models/details')


var config = require('./config/db');
// var json2csv = require('json2csv');
const Json2csvParser = require('json2csv').Parser;
var json2csv = require('json2csv');

const fields = ['sales','segment','country','product','units_sold','manufacturing_price','sale_price','gross_sales'];
const opts = { fields };
var fs = require('fs');

mongoose.Promise = global.Promise;
mongoose.connect(config.db).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );


app.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx','csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');





            
/** API path that will upload the files */
// app.post('/upload', function(req, res) {
//     var exceltojson;
//     upload(req,res,function(err){
//         if(err){
//              res.json({error_code:1,err_desc:err});
//              return;
//         }
//         /** Multer gives us file info in req.file object */
//         if(!req.file){
//             res.json({error_code:1,err_desc:"No file passed"});
//             return;
//         }
       
//         if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
//             exceltojson = xlsxtojson;
//         } else {
//             exceltojson = xlstojson;
//         }
//         try {
//             exceltojson({
//                 input: req.file.path,
//                 output: null, //since we don't need output.json
//                 lowerCaseHeaders:true
//             }, function(err,result){
//                 if(err) {
//                     return res.json({error_code:1,err_desc:err, data: null});
//                 }
                
//                 res.json({error_code:0,err_desc:null, data: result});
//              console.log(result[0]["sales"]);

            
//     const parser = new Json2csvParser(opts);
//     const csv = parser.parse(result);
//                                                 // this is csv file stroed in local folder
//      fs.writeFile('./uploads/file.csv', csv, function(err) {
//         if (err) throw err;
//         console.log(csv);


//         //  res.send("done");
//       });
              
//             //   fire.save((err)=>{
//             //     if(err) return console.error(err.stack);
//             //     console.log("fire is added")
//             //  });
        
         
//             });
//         } catch (e){
//             res.json({error_code:1,err_desc:"Corupted excel file"});
//         }
//     })
// });

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
 
    var authors = [];
         
    csv
     .fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         authors.push(data);
     })
     .on("end", function(){
        detail.create(authors, function(err, documents) {
            if (err) throw err;
         });
          
         res.send(authors.length + ' authors have been successfully uploaded.');
     });
});



app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});
app.listen('3000', function(){
    console.log('running on 3000...');
});