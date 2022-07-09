const fs = require('fs');
const util = require('util');
var term = require('terminal-kit').terminal;
var ship1 = require('./data/ship.js').ship1;
var comms = require('./data/commands.js').comms;


// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);

// You can now use `readFile()` with `await`!

var main_text = 'not init';
var action = [];


var maindata = {};


async function loadScene(path) {
    // console.log('reading ' + path);
    const buf = await readFile(path);
    try {
        maindata = JSON.parse(buf.toString('utf-8'));
        // console.dir(maindata);
        main_text = maindata.main;
        action = maindata['action'];
        render(true);
        return;
    } catch (error) {
        console.log('reading :' + error);
    }
}


async function main() {
    loadScene('./scenes/title.json');
    // render(true);
}

main();

function render(all) {
    if (all) {
        // term.clear();
        term(`\n${main_text}\n`);
    }
    term.green('> ');
    term.inputField(
        function (error, entry) {
            act = action[entry];
            if (act == null) {
                if (comms[entry]) {
                    proccCommand(entry);
                    render(false);
                    return;
                }
                term.red('\ncommand not available this time\n');
                term.grabInput(false);
                render(false);
                // process.exit();
            } else {
                term.grabInput(false);
                // console.log(entry);
                // console.log(myAct[entry]);
                // act();
                switch (act.ops) {
                    case 'term':
                        term.brightBlue(`\n${act.args}\n`);
                        render(false);
                        break;
                    case 'loadScene':
                        loadScene(act.args);
                        break;
                    case 'openShop':
                        openShop(act.args, maindata.name);
                        break;
                    case 'closeApp':
                        term.green("\nGood bye!\n");
                        process.exit();

                    default:
                        break;
                }
            }

        });
}


function openShop(items, name) {

    term(`\nWelcome to ${name} trade post:\n`);

    term('Our goods:\n');
    term.brightCyan("--------------------------\n");
    term.brightCyan("Goods\t\tPrice\n");
    term.brightCyan("--------------------------\n");

    for (var k in items) {
        term(`${k}\t\t ${items[k]}\n`);
    }
    term.brightCyan("--------------------------\n");
    term("you can ^Gbuy ^W, ^Gsell ^Wor ^Gexitshop\n");
    term.green('> ');
    term.inputField(
        function (error, entry) {
            if (entry == 'exitshop') {
                term.green("\nGood bye!\n");
                render();
            }
            else {
                term.green("\nok then!\n");
                openShop(items, name);
            }
        }
    );
}

function proccCommand(entry) {
    switch (entry) {
        case 'help':
            showHelp();
            break;
        case 'attr':
            showCargo();
            break;
        case 'clear':
            term.clear();
            break;
        case 'exit':
            term.green("\nGood bye!\n");
            process.exit();

        default:
            break;
    }
}

function showHelp() {
    term('\nHere are the commands you can use:\n');

    var temp = [];
    var idx = 0;
    for (var k in comms) {
        temp[idx++] = [k + " ", comms[k]];
    }
    term.table(
        temp,
        { hasBorder: false }
    );

}


function showCargo() {
    term('\nYour cargo:\n');
    term.brightCyan("--------------------------\n");
    weight = 0;
    for (var k in ship1.cargo) {
        term.brightBlue(`${k}\t ${ship1.cargo[k]}\n`);
        weight += ship1.cargo[k];
    }

    term.brightCyan("--------------------------\n");
    term.brightCyan(`cargo : ${weight} / `);
    term.brightBlue(`${ship1.cargo_max} kg\n`);

}
