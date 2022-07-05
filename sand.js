var term = require( 'terminal-kit' ).terminal ;

function terminate() {
	term.grabInput( false ) ;
	setTimeout( function() { process.exit() } , 100 ) ;
}

var idx =0;

var text = [
'text 1 text 1 text 1 text 1 ',
'text 2 text 2 text 1 text 2 ',
'text 2 text 3 text 1 text 3 ',
'text 2 text 4 text 1 text 4 ',
'text 2 text 5 text 1 text 5 ',
];

term.bold.cyan( 'Type anything on the keyboard...\n' ) ;
term.green( 'Hit CTRL-C to quit.\n\n' ) ;

term.grabInput( { mouse: 'button' } ) ;

// term.on( 'key' , function( name , matches , data ) {
// 	// console.log(text[idx++]);
// 	// console.log( "'key' event:" , name ) ;
// 	term.blue(Date.now()+'\n');
// 	if ( name === 'CTRL_C' ) { terminate() ; }
// } ) ;

// term.inputField(
// 	function( error , input ) {
// 		if ( error ){
// 			term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
// 		}
// 		if(input == 'exit'){
			
// 			process.exit();
// 		}else{
// 			term.blue(Date.now()+'\n');
// 			term.grabInput( false ) ;
// 		}
// 	}
// );

function question() {
	term( 'Do you like javascript? [Y|n]\n' ) ;
	
	// Exit on y and ENTER key
	// Ask again on n
	term.inputField(
		function( error , input ) {
	
		if ( input == 'exit' ) {
			term.green( "Good bye!\n" ) ;
			process.exit() ;
		}
		else {
			term.blue(Date.now()+'\n');
			question() ;
		}
	} ) ;
}

question() ;


/// =======

// process.stdin.on('data', data => {
// 	if(data.toString=='clear'){
// 		console.clear();
// 	}
// 	console.log(`You typed ${data.toString()}`);
// 	// console.log(text[idx++]);
// 	// process.exit();
//   });