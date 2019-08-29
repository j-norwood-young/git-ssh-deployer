const config = require("config");
const Node_ssh = require("node-ssh");

const http = require('http');

const handleHook = async data => {
    console.log(data);
    let cmd = config.cmd;
    if (!Array.isArray(cmd)) cmd = [cmd];
    ssh = new Node_ssh();
    for(let host of config.servers) {
        try {
            await ssh.connect({
                host,
                username: config.username,
                private_key: config.private_key
            });
            for (let cmd of cmds) {
                console.log(`Running ${ cmd }`);
                let result = ssh.execCommand(cmd, { cwd: config.working_directory });
                console.log(result);
            }
        } catch(err) {
            console.error(err);
        }
    }
    
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