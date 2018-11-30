const async = require('async');
const util = require('util');
const {Worker} = require('worker_threads');

const parallel = util.promisify(async.parallel);

module.exports = class {
    constructor(app) {
        this.app = app;
        this.dirty = false;
        this.running = false;
    }

    async update() {
        if (this.running) {
            console.log('Current simulation marked dirty');
            this.dirty = true;
            return;
        }

        this.running = true;

        do {
            this.dirty = false;

            console.log('Starting simulation');
            let data = await this._run();
            this.app.locals.data = data;
            console.log('Simulation complete');
        } while (this.dirty);

        this.running = false;
    }

    async _run() {
        let db = this.app.locals.db;
        let data = await parallel({
            nodes: function(callback) {
                const nodes = db.collection('nodes');
                nodes.find({}, {projection:{_id: 0}}).toArray(callback);
            },
            links: function(callback) {
                const links = db.collection('links');
                links.find({}, {projection:{_id: 0}}).toArray(callback);
            }
        });

        // filter broken links
        let nodeSet = new Set(data.nodes.map(node => node.id));
        data.links = data.links.filter(link =>
            nodeSet.has(link.source) && nodeSet.has(link.target));

        return await this._simulate(data);
    }

    _simulate(data) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker.js', {
                workerData: data
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}
