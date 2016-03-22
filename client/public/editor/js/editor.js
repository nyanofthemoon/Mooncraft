function getDefaultRegion() { return {
    editor: {
        x: 10,
        y: 10,

    },
    data: {
        name: 'Untitled',
        description: '',
        'fixture'    : {},
        'progress'    : {
            'nodes': [],
            'items': []
        }
    },
    tiles: [],
    nodes: [],
    items: []
}; }


var region = getDefaultRegion();

console.log(region);
console.log(TILES);

$(document).ready(function() {



});