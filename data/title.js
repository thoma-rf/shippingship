var k = require ('../utility.js');

maindata = {

    'main_text': `Shipping Ship 
1) New Game
2) Exit
`,
    'action': {
        '1': async () => {
            await k.loadScene('./data/data1.js');
            // render();
        },
        '2': () => {
            process.exit();
        }

    }
}

exports.maindata = maindata;