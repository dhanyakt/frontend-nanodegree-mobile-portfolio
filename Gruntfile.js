'use-strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        inline: {
            build: {
                options: {
                    cssmin: true
                },
                src: 'index.html',
                dest: 'build/'
            }
        },

        pagespeed: {
            options: {
                nokey: true,
                locale: "en_GB",
                threshold:30
            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-inline');

    grunt.registerTask('psi-ngrok','Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8000;
        ngrok.connect(port, function(err,url){
            if(err !== null) {
                grunt.fail.fatal(err);
                return done();
            }

            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

    grunt.registerTask('default',['inline','psi-ngrok']);
};