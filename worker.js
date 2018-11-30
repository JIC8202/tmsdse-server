const d3 = require('d3-force');
const {parentPort, workerData} = require('worker_threads');

let data = workerData;

// link force resolves source/target to object references, so run it first
let simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink().links(data.links).distance(40).id(d => d.id));

// calculate degree of nodes
data.nodes.forEach(d => {
    d.degree = 0;
});
data.links.forEach(d => {
    d.target.degree++;
    d.source.degree++;
});

simulation.force('collide', d3.forceCollide(nodeSize))
    .force('charge', d3.forceManyBody())
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .stop();

// run synchronously
while (simulation.alpha() > simulation.alphaMin())
    simulation.tick();

// replace object references with indices
data.links.forEach(link => {
    link.source = link.source.index;
    link.target = link.target.index;
    delete link.index;
});
// remove unnecessary data
data.nodes.forEach(node => {
    delete node.degree;
    delete node.index;
    delete node.vx;
    delete node.vy;
})

parentPort.postMessage(data);

function nodeSize(d) {
    return Math.sqrt(d.degree) + 5;
}
