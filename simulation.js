const async = require('async');
const d3 = require('d3-force');
const util = require('util');

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
        return new Promise(resolve => {
            let simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink().links(data.links).distance(40).id(d => d.id));

            // calculate degree
            data.nodes.forEach(d => {
                d.degree = 0;
            });
            data.links.forEach(d => {
                d.target.degree++;
                d.source.degree++;
            });

            simulation.force('collide', d3.forceCollide(this._nodeSize))
            .force('charge', d3.forceManyBody())
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .on('end', () => {
                // remove object references
                data.links.forEach(link => {
                    link.source = link.source.index;
                    link.target = link.target.index;
                });
                resolve(data);
            });
        });
    }

    _nodeSize(d) {
        return Math.sqrt(d.degree) + 5;
    }
}
