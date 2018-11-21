const fs = require('fs');
const https = require('https');
const app = require('./app');

const credentials = {
    key: fs.readFileSync('sslcert/privkey.pem', 'utf8'),
    cert: fs.readFileSync('sslcert/fullchain.pem', 'utf8')
};

const port = process.env.PORT || 443;

const server = https.createServer(credentials, app);

server.listen(port);