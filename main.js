
var term = require('terminal-kit').terminal;


var main_text =
    `Night Walkers

1) New Game
2) Load Game

 ` ;

var input = { 'type': 'text' };
var action =
{
    '1': () => {
        loadScene2();
        render();
    },
    '2': () => {
        process.exit();
    }

};

function loadScene2() {
    main_text =
        `you are now in the scene 2
1) exit

` ;

    input = { 'type': 'text' };
    action = {
        '1': () => {
            loadScene2();
            render();
        }, '2': () => { term('bye\n'); process.exit() }
    };
    // render(true);

}

render(true);



function render() {
    term.clear();
    term(main_text);

    // Exit on y and ENTER key
    // Ask again on n
    term.inputField(
        function (error, entry) {

            if (entry == 'exit') {
                term.green("Good bye!\n");
                process.exit();
            }
            else {
                act = action[entry];
                if (act == null) {
                    console.log('n >>>' + entry);
                    term.red('\nno such bullshit\n');

                    term.grabInput(false);
                    render({}, false);
                    // process.exit();
                } else {
                    term.grabInput(false);
                    // console.log(entry);
                    // console.log(myAct[entry]);
                    act();
                }
            }
        });
}

/*
// function render(data, all) {
//     if (all) {
//         term.blue('\n' + main_text);
//     }


//     typ = input['type'];
//     switch (typ) {
//         case 'text':
//             term.green('> ');

//             term.inputField(
//                 function (error, entry) {
//                     if (error) {
//                         term.red.bold("\nAn error occurs: " + error + "\n");
//                     }
//                     else {
//                         act = action[entry];
//                         if (act == null) {
//                             console.log('n >>>'+entry);
//                             term.red('\nno such bullshit\n');

//                             term.grabInput( false ) ;
//                             render({}, false);
//                             // process.exit();
//                         } else {
//                             term.grabInput( false ) ;
//                             // console.log(entry);
//                             // console.log(myAct[entry]);
//                             act();
//                         }

//                     }
//                 }
//             );
//     }
// }
*/





// term(main_text+'\n');

// console.log('cuk cuk cuk')