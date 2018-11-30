const fs = require('fs');
const {MongoClient} = require('mongodb');
const spdy = require('spdy');

const loadApp = require('./app');
require('dotenv').config();

const credentials = {
    key: fs.readFileSync('sslcert/privkey.pem', 'utf8'),
    cert: fs.readFileSync('sslcert/fullchain.pem', 'utf8')
};

(async () => {
    let client = await MongoClient.connect(process.env.MONGO_URI,
        {useNewUrlParser: true});
    console.log('Connected to MongoDB');

    let port = process.env.PORT || 443;
    let app = loadApp(client.db());

    let server = spdy.createServer(credentials, app);
    server.listen(port);
    console.log(`Server listening on :${port}`);
})();
