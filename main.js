const fs = require('fs');
const { type } = require('os');
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

async function loadStory(path) {
    console.log('load story' + path)
    const buf = await readFile(path);
    term.grabInput(true);
    try {
        var lines = JSON.parse(buf.toString('utf-8'));
        await tell(lines, 0);
        // term.grabInput(false) ;
        return;
    } catch (error) {
        console.log('reading :' + error);
    }
}

async function tell(lines, idx) { 
    // console.log('telling');

    term(lines[idx++]);
    term("\n\n^Gpress a key >");
    term.on('key', function (name, matches, data) {
        term.up(1);
        term.deleteLine();
        term(lines[idx++]);
        term("\n\n^Gpress a key >");
        if (idx == lines.length - 1) {
            term.deleteLine();
            term.removeAllListeners();
            term.grabInput(false);
            // setTimeout(function () {
                act = lines[idx];
                if (act.ops == 'loadScene')
                    loadScene(act.args);
                else {
                    process.exit();
                }
            // }, 1000);

        }
    });
}



async function loadScene(path) {
    
    
    const buf = await readFile(path);
    try {
        maindata = JSON.parse(buf.toString('utf-8'));
        // console.dir(maindata);
        main_text = maindata.main;
        ship1.town = maindata.name;
        action = maindata['action'];
        if(ship1.town){
        term.bold.brightBlue('Entering ' + ship1.town+".. \n");
        setTimeout(function(){
            render(true);
        },1000);
    }else{
        render(true);
    }
        return;
    } catch (error) {
        console.log('reading :' + error);
    }
}


async function main() {
    loadScene('./scenes/title.json');
    ship1.town = maindata.town;
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
                    case 'loadStory':
                        loadStory(act.args);
                        break;
                    case 'loadScene':
                        loadScene(act.args);
                        break;
                    case 'openShop':
                        openShop(act.args, maindata.name);
                        break;
                    case 'openTavern':
                        showTavern(true, act.args);
                        break;
                    case 'port':
                        showPort(act.args);
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


function openShop(items, name, nopricing) {
    if (!nopricing) {
        term(`\nWelcome to ${name} trade post:\n`);
        term('Our goods:\n');
        term.brightCyan("--------------------------\n");
        term.brightCyan("Goods\t\tPrice\n");
        term.brightCyan("--------------------------\n");

        for (var k in items) {
            term(`${k}\t\t ${items[k]}\n`);
        }
        term.brightCyan("--------------------------\n");
        term("you can ^Gbuy^W, ^Gsell^W, ^Gcargo, ^Wor ^Gexit\n");
    }
    term.green('shop > ');
    term.inputField(
        function (error, entry) {
            if (entry == 'exit') {
                term.green("\nExiting shop, bye!\n");
                render();
            }
            else {
                var entries = entry.split(" ");
                if (entry == 'price') {
                    openShop(items, name, true);
                    return;
                } else
                    if (entry == 'cargo') {
                        showCargo();
                    } else {
                        if (entries[0] == 'buy') {
                            if (entries.length != 3) {
                                term('\ninvalid buy\n');
                                term('example: buy cinnamon 10\n');
                            }
                            if (entries[0] == 'buy') {
                                item_ = entries[1];
                                qty = entries[2];
                                price = items[item_];
                                totPrice = items[item_] * qty;

                                if (isNaN(qty)) {
                                    term('\ninvalid quantity\n');
                                    term('example: buy cinnamon 10\n');
                                    openShop(items, name, true);
                                    return;
                                }

                                if (!price) {
                                    term('\ninvalid buy\n');
                                    term('no such item\n');
                                    openShop(items, name, true);
                                    return;
                                }

                                if (ship1.coin < totPrice) {
                                    term(`\nyour coin: ^Y${ship1.coin}  ^W| price: ^R${totPrice}`);
                                    term('\ninvalid buy\n');
                                    term('not enough coin\n');
                                    openShop(items, name, true);
                                    return;
                                }
                                cargoW = 0;
                                for (ww in ship1.cargo) {
                                    cargoW += ship1.cargo[ww];
                                }
                                cargoW += parseInt(qty);
                                if (ship1.cargo_max < cargoW) {
                                    term(`\nyour cargo: ^Y${ship1.coin}  ^W| required: ^R${cargoW}`);
                                    term('\ninvalid buy\n');
                                    term('not enough cargo\n');
                                    openShop(items, name, true);
                                    return;
                                }
                                ship1.cargo[item_] += parseInt(qty);
                                ship1.coin -= totPrice;
                                term.green('\nthanks for the purchase\n');

                            } else if (entries[0] == 'sell') {

                            }
                        }
                    }
                openShop(items, name, true);
            }
        }
    );
}

function proccCommand(entry) {
    if (!ship1.town) {
        term("\nplease start the game\n");
        return;
    }
    switch (entry) {
        case 'help':
            showHelp();
            break;
        case 'map':
            showMap();
            break;
        case 'status':
        case 'stat':
            showStat();
            break;
        case 'clear':
            term.clear();
            break;
        case 'q':
        case 'quit':
            term.green("\nGood bye!\n");
            process.exit();

        default:
            break;
    }
}

function showPort(routes,noBegin) {
    if (!noBegin) {
        term(`\nPrepare to sail from ^Y${main.name}^W. available routes:\n`);
        var idx = 0;
        for (kk in routes) {
            term(`${idx++}) ${routes[kk].name} \t${routes[kk].time} day(s)\n`);
        }
        term.blue("-----------------------------\n");
        term("you can use sail or exit. ex: ^B sail 1\n");

    }
    term.green('port > ');
    term.inputField(
        function (error, entry) {
            entries = entry.split(' ');
            if (entry == 'exit') {
                term.green("\nExiting port, bye!\n");
                render();
                return;
            }else if(entries.length == 2 && entries[1] < routes.length){
                idx_ = parseInt(entries[1]) ;
                term('\nsailing to '+ routes[idx_].name+'...');
                act = routes[idx_].act;
                console.dir(act);
                ship1.day += routes[idx_].time;
                if(act.ops == 'loadScene'){
                    loadScene(act.args);
                }else {
                    term.red('\nnon tranversable\n');
                    showPort(routes,true);
                }
            }else{
                term('\ninvalid command\n');
                showPort(routes,true);
            }
        }
    );
}

function showTavern(begin, ppl) {
    if (begin) {
        term(`\nEntered ^Y${main.name}^W's tavern. there are:\n`);
        for (kk in ppl) {
            term(`${kk}) ${ppl[kk][0]}\n`);
        }
        term.blue("-----------------------------\n");
        term("you can use talk or exit. ex: ^Gtalk 1\n");

    }
    term.green('tavern > ');
    term.inputField(
        function (error, entry) {
            entries = entry.split(' ');
            if (entry == 'exit') {
                term.green("\nExiting tavern, bye!\n");
                render();
                return;
            }
            if (entries.length == 2 && entries[1] < ppl.length) {
                term(`\n${ppl[entries[1]][1]}\n`)
            } else {
                term('\ninvalid talk\n');
            }
            showTavern(false, ppl)
        }
    );
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
        { hasBorder: false, contentHasMarkup: true }
    );

}

function showMap() {

    term(" \n                    ^B3 ------------- ^YTirtamulya ^B--\n                   /                              /\n^YB Asri ^B—-- 2 —— ^YPalawitan  ^B--- 2 -- ^YDanakerta ^B- 1\n      \\                                  /\n       \\                                /\n        \\3-- ^YRajamas ^B--1-- ^YTj Arum ^B- 1 -\n");
}

function showStat() {
    term(`\nDay:${ship1.day} in ${ship1.town}`)
    term(`\n^YCoin:${ship1.coin}`)
    term('\n^WYour ship:\n');
    term.brightCyan("--------------------------\n");
    term(`body\t ${ship1.body}\n`);
    term(`sail\t ${ship1.sail}\n`);
    term(`armor\t ${ship1.armor}\n`);
    term(`gun\t ${ship1.gun}/${ship1.max_gun}\n`);
    term(`crew\t ${ship1.crew}/${ship1.crew_max}\n`);
    term.brightCyan("--------------------------\n");
    showCargo();

}
function showCargo() {
    term('\nYour cargo:\n');
    term.brightCyan("--------------------------\n");
    weight = 0;
    for (var k in ship1.cargo) {
        term(`${k}\t ${ship1.cargo[k]}\n`);
        weight += ship1.cargo[k];
    }

    term.brightCyan("--------------------------\n");
    term(`cargo : ${weight} / ${ship1.cargo_max} kg\n`);

}

