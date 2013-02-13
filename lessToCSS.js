var lessToCSS = function(){

    var fs = require('fs')
    , less = require('less')
    , parser = new(less.Parser)
    , readFile = fs.readFileSync
    , writeFile = fs.writeFileSync;

    function parserCSS(path) {
        parser.parse(readFile('./views/' + path,'utf8') , function (err, tree) {
            if (err) { return console.error(err) }
            writeFile('./public/stylesheets/' +
                path.slice(0,path.lastIndexOf('.less')) + '.css',
                tree.toCSS({ compress: true }),'utf8')
        });
    }

    parserCSS('post_modify_style.less');
}

module.exports = lessToCSS;