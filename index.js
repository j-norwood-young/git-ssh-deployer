const config = require("config");
const ssh = require("node-ssh");

const http = require('http');

const handleHook = data => {
    console.log(data);
}

const httpServer = (req, res) => {
    let data = []
    req.on('data', chunk => {
        data.push(chunk)
    });
    req.on('end', () => {
        try {
            const completed_data = JSON.parse(data);
            handleHook(completed_data);
        } catch(err) {
            console.error("Error parsing data", err);
        }
    })
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`Got it, thanks!`);
    res.end();
}

const app = http.createServer(httpServer);

app.listen(config.port);