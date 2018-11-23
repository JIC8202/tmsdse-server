const fs = require('fs');
const spdy = require('spdy');
const loadApp = require('./app');

const credentials = {
    key: fs.readFileSync('sslcert/privkey.pem', 'utf8'),
    cert: fs.readFileSync('sslcert/fullchain.pem', 'utf8')
};

const port = process.env.PORT || 443;

loadApp().then(app => {
    const server = spdy.createServer(credentials, app);
    server.listen(port);
    console.log(`Server listening on :${port}`);
});
