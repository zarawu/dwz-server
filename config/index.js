const localConfig =  require('./local.js');
const developmentConfig =  require('./development.js');

var CONFIG = localConfig;

// 除了生产环境都是用测试环境的配置
function setConfig(evnName) {
    switch (evnName){
        case 'development':
            CONFIG = developmentConfig;
            break;
        default :
            CONFIG = localConfig;
            break;
    }
}

function getConfig() {
    return CONFIG;
}


function init(evnName) {
    setConfig(evnName);
    return getConfig();
}

module.exports={
    init: init
};