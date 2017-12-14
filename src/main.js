// https://github.com/ssartell/advent-of-code-2017/blob/master/day14/part2.js
var R = require('ramda');
var knot = require('./day10');
var M = require('mnemonist');
var d3 = require('d3');
var randomColor = require('./randomColor');

var toHashes = x => R.map(y => knot(`${x}-${y}`), R.range(0, 128));
var parseInput = R.pipe(R.trim, toHashes);

var pad = n => ("000" + n).substr(-4);
var hexToBinary = x => pad(parseInt(x, 16).toString(2));

var neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
var add = (a, b) => R.map(R.sum, R.zip(a, b));
var inBounds = pos => 0 <= pos.x && pos.x <= 127 && 0 <= pos.y && pos.y <= 127; 

var root = d3.select(document.getElementById("chart")).append("table").append("tbody");
var colors = {};

function update(regions, x, y) {
    var r = root.selectAll('tr').data(regions);
    r = r.enter().append('tr').merge(r);
    r.each(function(v, ix1) {
        var c = d3.select(this).selectAll('td').data(function(d) { return d; });
        c = c.enter().append('td').merge(c);
        c.text(function(d) { return d; });
        c.style('font-weight', function(d, ix2) { return (y == ix1 && x == ix2) ? 'bold' : null; });
        c.style('color', function(d) {
            if(!colors[d]) {
                colors[d] = randomColor();
            }
            return colors[d];
        })
    });
}

var run = blocks => {
    var regionBlocks = [];
    for(var i=0; i<blocks.length; i++) {
        regionBlocks[i] = [];
        for(var j=0; j<blocks[i].length; j++){
            regionBlocks[i][j] = blocks[i][j] ? '#' : '.';
        }
    }
    update(regionBlocks, -1, -1);

    var regions = 0;
    var visited = {};
    var queue = new M.MinHeap(R.comparator((a, b) => 
        ((a.fromRegion && blocks[a.x][a.y] === 1) || !(b.fromRegion && blocks[b.x][b.y] === 1)) 
        && (blocks[a.x][a.y] >= blocks[b.x][b.y])
    ));
    queue.push({x: 0, y: 0, fromRegion: false});

    function runNext() {
        var pos = queue.pop();
        
        var key = `${pos.x},${pos.y}`;
        if (!visited[key]) {
            visited[key] = true;
            
            var val = blocks[pos.x][pos.y];
            if (val === 1 && !pos.fromRegion) regions++;
    
            if(blocks[pos.x][pos.y]) {
                regionBlocks[pos.x][pos.y] = regions;
            }
            update(regionBlocks, pos.x, pos.y);
            
            for(var neighbor of neighbors) {
                var newPos = {x: pos.x + neighbor[0], y: pos.y + neighbor[1], fromRegion: val === 1 };
                if (inBounds(newPos)) queue.push(newPos);
            }
        }

        if(queue.size) {
            setTimeout(() => runNext(), 10);
        }
    }
    runNext();
};

var solution = R.pipe(parseInput, R.map(R.map(hexToBinary)), R.map(R.chain(R.map(parseInt))), run);

solution();

module.exports = solution;
