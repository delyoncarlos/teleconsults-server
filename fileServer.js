// TODO: improve this draft!
// this file server just gets a file at a time.
var http = require('http');
var fs = require('fs');

const port = 5000;
const baseDir = __dirname + '/uploads/';

module.exports.startFileServer = function() {
    http.createServer((req, res) => {
        // remove the trailing data from url
        let searchParams = new URLSearchParams(req.url.split('?')[1]);
        const type = searchParams.get('type');
        const id = searchParams.get('id');
        const filename = searchParams.get('filename');

        // getting the file
        var file = fs.createReadStream(`${baseDir}${type}s/${id}/${filename}`);
        res.writeHead(200, { 'Content-disposition': `attachment; filename=${filename}` });
        file.pipe(res);
    }).listen(port);

    console.log(`📂 File server listening in the port ${port}.`);
}