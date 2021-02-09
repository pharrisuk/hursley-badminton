/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com

var express = require('express'),
    util = require('util'),
    compression = require('compression'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs');

var bodyParser = require('body-parser');


// create a new express server
var app = express();

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

app.use(compression({
    filter: shouldCompress
}))

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header 
        return false
    }

    // fallback to standard filter function 
    return compression.filter(req, res)
}


// static - all our js, css, images, etc go into the assets path
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/fonts', express.static(__dirname + '/bower_components/font-awesome/fonts'));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/img', express.static(__dirname + '/public/js/ExtraMarkers/img'));
app.use('/favicon.ico', express.static(__dirname + '/public/favicon.ico'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/uploads/', express.static(__dirname + '/public/uploads'));

app.use('/upload', function (req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/public/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name),(err)=>{});
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
});


app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


var options = {
    failureRedirect: '/?message=Unable to login due to error.'
};

// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.all('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//app.use(bodyParser.json());

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

// start server on the specified port and binding host