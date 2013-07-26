module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        transport : {
            options : {
                paths : ['.'],
                alias: '<%= pkg.spm.alias %>',
                handlebars:{
                    id:'lib/runtime'
                }
            },
            main:{
                options:{
                    idleading : 'dist/js/'
                },
                files : [
                    {
                        cwd : 'js/',
                        src : ['**/*'],
                        dest : '.build/js'
                    }
                ]
            }
        },
        concat : {
            options : {
                include : 'relative'
            },
            main:{
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['js/**/*.js','!js/**/*-debug.js'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        uglify : {
            options : {
                banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            main:{
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['js/**/*.js', '!js/**/*-debug.js'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        clean : {
            spm : ['.build']
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['transport', 'concat', 'clean']);
    //先合并 调整后再压缩
    grunt.registerTask('compress', ['uglify']);
};

