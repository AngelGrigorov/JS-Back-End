const http = require('http');
const port = 3000;

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Hello achka');
    res.end();
}).listen(port)