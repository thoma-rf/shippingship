var  maindata = {};

async function loadScene(path) {
    // console.log('reading '+path);
    maindata = await require(path).maindata;
    main_text = maindata['main_text'];

    action = maindata['action'];
    
    // console.log('reading :' + maindata.main_text);
    exports.maindata = maindata;
}

exports.loadScene = loadScene;