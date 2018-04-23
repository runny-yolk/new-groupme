module.exports = function(){
    var first = [
        'Bendysnatch',
        'Bomberhatch',
        'Buttercup',
        'Bodysnatch',
        'Buffalo',
        'Bumblesnuff',
        'Beneficial',
        'Barnabus',
        'Benedict',
        'Bacondick',
        'Bendynoodle',
        'Butterscotch',
        'Band-Aid',
        'Bumperstump',
        'Bonkyhort',
        'Banister'
    ];

    var last = [
        'Cummberbund',
        'Custardbath',
        'Crimpysnitch',
        'Cabbagewank',
        'Cumbersnatch',
        'Cucumber',
        'Cumberbatch',
        'Crumperbunts',
        'Chowderpants',
        'Cabbagepatch',
        'Cutiebrunch',
        'Countryside',
        'Candyhap'
    ];

    var name = '';

    name += first[ Math.floor(Math.random()*first.length) ];
    name += ' ';
    name += last[ Math.floor(Math.random()*last.length) ];

    name += Math.random().toString(10).slice(16);

    return name;
}