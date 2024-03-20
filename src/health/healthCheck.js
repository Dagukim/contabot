const { createServer } = require("http");

const healthCheck = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("OK");
    res.end();
});

module.exports = { healthCheck };

