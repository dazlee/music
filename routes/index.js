
/*
 * GET home page.
 */
var fs = require('fs');
var mm = require('musicmetadata');
var path = require('path');
console.log(mm);
exports.index = function(req, res){
    // create a new parser from a node ReadStream
    var parser = mm(fs.createReadStream('03 - She Will Be Loved.mp3'),{ duration: true });

    // listen for the metadata event
    parser.on('metadata', function (result) {
        console.log(result);
    });
    parser.on('artist', function (result) {
	  console.log(result);
	});
    res.render('index', { title: 'Express' });
};

exports.music = function(req, res){
	console.log(__dirname);
	fs.readdir(path.join(__dirname, '../music-sources'), function (err, files) {
        console.log(files);
        var mp3files = [];
        var mp3regex = /\.mp3/;
        files.forEach(function (file) {
            if (mp3regex.test(file)) {
                mp3files.push(file);
            }
        });
		res.render('music', { files: mp3files });
	});
};

exports.source = function (req, res) {
	console.log(req.query);
	var filePath = path.join(__dirname, '../music-sources' ,req.query.file);
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
};