var term = require('terminal-kit').terminal;


var text = [
    'text 1 text 1 text 1 text 1 ',
    'text 2 text 2 text 1 text 2 ',
    'text 2 text 3 text 1 text 3 ',
    'text 2 text 4 text 1 text 4 ',
    'text 2 text 5 text 1 text 5 ',
];

console.dir(text);
var idx = 0;
function tell() {
    // term( 'Do you like javascript? [Y|n]\n' ) ;

    // term.grabInput('button', function (name, matches, data) {
    //     // console.log(text[idx++]);
    //     console.log( "'key' event:" , name ) ;
    //     term.blue(text[idx++]);
    //     // if (name === 'CTRL_C' || idx >= text.length) { process.exit(); }
    //     tell();
    // });



    term.grabInput( { mouse: 'button' } ) ;
    term.on('key', function (name, matches, data) {
        console.log("'key' event:", name);
        if (name === 'CTRL_C') { term.processExit(); }
    });
}

tell();

