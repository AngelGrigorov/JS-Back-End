const http = require("http");
const port = 3000;
const controllers = require('./controllers/blender');

let app = http.createServer((req, res) => {
    for (let controller of controllers) {
        if (!controller(req, res)) {
            break;
        }      
    }
});

app.listen(port);

console.log(`Server is listening on port: ${port}...`);