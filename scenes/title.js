var term = require('terminal-kit').terminal;

term.blue('Night Walkers');

var pick = 
`\n1) New Game
2) Load Game
3) About\n`

term.down(1).blue(pick);


// term.singleColumnMenu(items, function (error, response) {
//     term('\n').eraseLineAfter.green(
//         "#%s selected: %s (%s,%s)\n",
//         response.selectedIndex,
//         response.selectedText,
//         response.x,
//         response.y
//     );
//     // process.exit();
// });
term.green('> ');

term.inputField(
	
	function( error , input ) {
		if(input == 'exit'){
			process.exit();
		}
		if ( error )
		{
			term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
		}
		else
		{
			term.green( "\nYour file is '%s'\n" , input ) ;
		}
		
		
	}
) ;