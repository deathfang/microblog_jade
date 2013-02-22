var lessToCSS = function(){

    var fs = require('fs')
    , less = require('less')
    , parser = new(less.Parser)
    , readdir = fs.readdirSync
    , readFile = fs.readFileSync
    , writeFile = fs.writeFileSync
    , path = require('path')
    , basename = path.basename
    , extname = path.extname

    function parserCSS(path) {
        readdir(path).forEach(function(file){
            if (extname(file) !== '.less') return;
            parser.parse(readFile(path + '/' + file,'utf8'), function (err, tree) {
                if (err) { return console.error(err) }
                writeFile('./public/stylesheets/' +
                    basename(file,'.less') + '.css',
                    tree.toCSS({ compress: true }),'utf8')
            });
        })
    }
    parserCSS('./views/less');
}
module.exports = lessToCSS;