//Modules
var path = require('path');
var moment = require('moment');

//Includes
var name = require('./package.json').name.toLowerCase();
var date = moment().format('YYYY-MM-DD_HH-mm-ss');
var mongoConfig = require('./server/config/mongo.js');
var loggerConfig = require('./server/config/logger.js');

//Create names
var appName = name + '_app';
var dbName = name + '_db';
var netName = name + '_net';

//Name suffix
var devSuffix = '_dev';
var testSuffix = '_test';

//Setup server
var setupScript = [
	'docker pull mongo',
	'docker pull node:slim',
	'sudo npm install -g gulp-cli bower karma',
	'bower install --config.analytics=false --allow-root',
	'chmod +x server.sh'
]

//Reset database
var resetScript = [
	'rm -r $PWD/data',
	'mkdir $PWD/data',
	'rm -r $PWD/logs',
	'mkdir $PWD/logs',
	'docker run --name ' + dbName + devSuffix + ' -d -v $PWD/data:/data/db -v $PWD/MongoDB.js:/home/MongoDB.js -w /home mongo mongod',
	'docker exec -i ' + dbName + devSuffix + ' mongo < ./MongoDB.js',
	'docker stop ' + dbName + devSuffix,
	'docker rm ' + dbName + devSuffix
]

//Build semantic ui
var semanticScript = [
	'cd semantic',
	'gulp clean',
	'gulp build'
]

//Development server
var devStartScript = [
	'docker network create ' + netName + devSuffix,
	'docker run --net=' + netName + devSuffix + ' --name ' + dbName + devSuffix + ' -d -p 27017:27017 -v $PWD/data:/data/db -w /home mongo mongod --auth', 
	'docker run --net=' + netName + devSuffix + ' --name ' + appName + devSuffix + ' -p 80:8080 -p 443:4434 -e "DBNAME=' + dbName + devSuffix + '" -e "NODE_ENV=development" -v $PWD:/home -w /home/server -t node:slim node app'
]
var devStopScript = [
	'docker stop ' + dbName + devSuffix,
	'docker rm ' + dbName + devSuffix,
	'docker stop ' + appName + devSuffix,
	'docker rm ' + appName + devSuffix,
	'docker network rm ' + netName + devSuffix
]

//Test server
var testStartScript = [
	'docker network create --driver bridge ' + netName + testSuffix,
	'docker run --net=' + netName + testSuffix + ' --name ' + dbName + testSuffix + ' -d -p 27017:27017 -v $PWD/Mongo.js:/home/Mongo.js -w /home mongo mongod --auth',
	'docker exec -i ' + dbName + testSuffix + ' mongo < ./MongoDB.js',
]
var testStopScript = [
	'docker stop ' + dbName + testSuffix,
	'docker rm ' + dbName + testSuffix,
	'docker stop ' + appName + testSuffix,
	'docker rm ' + appName + testSuffix,
	'docker network rm ' + netName + testSuffix
]

//Build distribution
var distScript = [
	'cd dist',
	'docker build -t ' + appName + ' -f Dockerfile.nodejs $PWD',
	'docker build -t ' + dbName + ' -f Dockerfile.mongodb $PWD',
	'docker save ' + appName + ' > ' + appName + '.tar',
	'docker save ' + dbName + ' > ' + dbName + '.tar',
	'rm package.json',
	'rm -r public',
	'rm -r server',
	'chmod +x server.sh'
]

//Stop development and testing server on exit 
var exec = require('child_process').exec;
var shutdown = function(){
	exec(devStopScript.join(' && '), function () {
	    exec(testStopScript.join(' && '), function () {
		    process.exit();
		});
    });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

//Grunt
module.exports = function(grunt) {

	//Configure Grunt Tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		clean: {
		
			//Clean directories before task execution
			build: {
				expand: true,
				src: ['public/**']
			},
			dist: {
				expand: true,
				src: ['dist/**']
			}
		},
	
	    copy: {
	        
	        //Copy all files which do not require building to the public folder
			build: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'bower_components',
		            src: [
		            	'angular/angular.min.js',
		            	'angular/angular.min.js.map',
		            	'angular-ui-router/release/angular-ui-router.js',
		            	'angular-ui-router/release/angular-ui-router.min.js',
		            	'jquery/dist/jquery.min.js',
		            	'jquery/dist/jquery.min.map'
		            ],
		            dest: 'public/libs'
				},{
					expand: true,
					cwd: 'semantic/dist',
		            src: ['semantic.min.js', 'semantic.min.css', 'themes/**/*.*'],
		            dest: 'public/libs'
				},{
					expand: true,
					cwd: 'client',
		            src: [
		            	'**/*.*',
		            	'!**/*.js',
		            	'!**/*.styl',
		            	'!**/*.jade'
		            ],
		            dest: 'public'
				}]
			},
			
			//Copy all files which are needed for testing to the public folder
			test: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'bower_components',
		            src: [
		            	'angular-mocks/angular-mocks.js',
		            	'chai/chai.js'
		            ],
		            dest: 'public/libs'
				}]
			},
			
			//Copy all required files to dist folder before docker build
			dist: {
				files: [{
					expand: true,
					cwd: '',
		            src: [
			            'package.json',
		            	'server/**/*.*',
		            	'public/**/*.*',
		            	'!server/**/*.mock.js',
		            	'!server/**/*.stub.js',
		            	'!server/**/*.test.js',
		            	'!server/**/*.spec.js',
		            	'!server/**/*.db.js'
		            ],
		            dest: 'dist'
				}]
			}
	    },
		
		jade: {
			
			//Build html files from client to pubic directory
			build: {
				options: {
			    	data: function(dest, src){
				    	return {
							
							//Inject relative path into template which can be accessed via {dir} variable
							dir: path.dirname(dest).replace('public','')
						};
			    	}
		    	},
				files: [{
					expand: true,
					cwd: 'client',
					src: ['**/*.jade', '!**/*.inc.jade'],
					dest: 'public',
					ext: '.html'
				}]
			}
		},

		stylus: {
		
			//Build and minify css files from client to public directory
			build: {
				files: [{
					'public/app.min.css': ['client/**/*.styl']
				}]
			}
		},
		
		ngAnnotate: {
		
			//Concatenate js and angular files from client to public directory
			build: {
				files: [{
					'public/app.min.js': [
						'client/app.js', 
						'client/**/*.js',
						'!client/**/*.inc.js',
		            	'!client/**/*.mock.js',
		            	'!client/**/*.stub.js',
		            	'!client/**/*.test.js',
		            	'!client/**/*.spec.js',
		            	'!client/**/*.db.js'
					]
				}]
			}
		},
		
		uglify: {
		
			//Minify js and angular files which have already been put into the public directory
			build: {
				options: {
					mangle: false
				},
				files: [{
					'public/app.min.js': 'public/app.min.js'
				}]
			}
    	},
		
		watch: {
		
			//Watch for any file changes in the client or server direcotires to rebuild and reload the server
		    options: {
				livereload: true
		    },
		    client: {
		        files: 'client/**/*.*',
		        tasks: ['build'],
		        options: {
		            spawn: false
		        }
		    },
		    app: {
		        files: 'server/**/*.*',
		        tasks: ['dev:stop', 'dev:start'],
		        options: {
		            spawn: false
		        }
		    }
		},
		
		compress: {
			
			//Archive dist directory into tar gz file
			dist: {
				options: {
					archive: 'dist/' + name + '_' + date + '.tar.gz',
					mode: 'tgz'
			    },
			    files: [{
				    expand: true,
				    cwd: 'dist',
					src: ['**'],
					dest: 'dist'
			    }]
			}
		},
		
		shell: {
			
			//Setup the development enviroment
			setup: {
				command: setupScript.join(' && '),
				options: {
					async: false
				}
			},
			
			//Reset the development enviroment
			reset: {
				command: resetScript.join(' && '),
				options: {
					async: false
				}
			},
			
			//Rebuild semantic ui framework
			semantic: {
				command: semanticScript.join(' && '),
				options: {
					async: false
				}
			},
			
			//Start and stop development server in docker
			devStart: {
				command: devStartScript.join(' && '),
				options: {
					async: true
				}
			},
			devStop: {
				command: devStopScript.join(' || true && '),
				options: {
					async: false,
					stderr: false,
					stdout: false,
					failOnError: false
				}
			},
			
			//Start and stop testing server in docker
			testStart: {
				command: testStartScript.join(' && '),
				options: {
					async: false
				}
			},
			testStop: {
				command: testStopScript.join(' || true && '),
				options: {
					async: false,
					stderr: false,
					stdout: false,
					failOnError: false
				}
			},
			
			//Buid into production app in dist folder
			dist: {
				command: distScript.join(' && '),
				options: {
					async: false
				}
			}
		},
		
		//Run server side automated tests
		mochaTest: {
			test: {
				src: [
					'server/**/setup.test.js',
					'server/**/*.db.js',
					'server/**/*.mock.js',
					'server/**/*.stub.js',
					'server/**/*.spec.js',
					'server/**/*.test.js'
				]
			}
		},
		
		//Run client side automated tests
		karma: {
			test: {
				configFile: 'karma.conf.js'
			}
		},
		
		//Wait for 2 seconds before tests start
		wait: {
			test: {
				options: {
					delay: 2000
				}
			}
		},
		
		//Replace parameters in distribution builds
		replace: {
			dist: {
				options: {
					patterns: [{
						match: 'APPNAME',
						replacement: appName
					},{
						match: 'DBNAME',
						replacement: dbName
					},{
						match: 'NETNAME',
						replacement: netName
					},{
						match: 'DATADIR',
						replacement: mongoConfig.path
					},{
						match: 'LOGDIR',
						replacement: loggerConfig.path
					}]
				},
				files: [{
					expand: true,
					flatten: true,
		            src: ['server.sh', 'docker-compose.yml', 'MongoDB.js', 'Dockerfile.mongodb', 'Dockerfile.nodejs'],
		            dest: 'dist'
				}]
			}
		}
	});
  
	//Load Tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-wait');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-karma');
	
	//Default Task
	grunt.registerTask('default', ['dev']);
	grunt.registerTask('stop', ['dev:stop', 'test:stop']);
	
	//Setup Tasks
	grunt.registerTask('setup', ['shell:setup', 'semantic', 'reset']);
	grunt.registerTask('semantic', ['shell:semantic']);
	grunt.registerTask('reset', ['dev:stop', 'shell:reset']);
	
	//Build Tasks
	grunt.registerTask('build:js', ['ngAnnotate:build', 'uglify:build']);
	grunt.registerTask('build:css', ['stylus:build']);
	grunt.registerTask('build:html', ['jade:build']);
	grunt.registerTask('build', ['clean:build', 'copy:build', 'build:html', 'build:css', 'build:js']);
	
	//Development Tasks
	grunt.registerTask('dev', ['dev:stop', 'build', 'dev:start', 'watch', 'dev:stop']);
	grunt.registerTask('dev:start', ['shell:devStart']);
	grunt.registerTask('dev:stop', ['shell:devStop']);
	
	//Testing Tasks
	grunt.registerTask('test', ['test:server', 'test:client']);
	grunt.registerTask('test:start', ['test:server:start']);
	grunt.registerTask('test:stop', ['test:server:stop']);
	
	//Server Testing Tasks
	grunt.registerTask('test:server', ['test:server:stop', 'build', 'copy:test', 'test:server:start', 'mochaTest:test', 'test:server:stop']);
	grunt.registerTask('test:server:start', ['shell:testStart']);
	grunt.registerTask('test:server:stop', ['shell:testStop']);
	
	//Client Testing Tasks
	grunt.registerTask('test:client', ['build', 'copy:test', 'karma:test']);
	
	//Distribution Tasks
	grunt.registerTask('dist', ['stop', 'semantic', 'build', 'clean:dist', 'copy:dist', 'replace:dist', 'shell:dist']);
	grunt.registerTask('compress', ['compress:dist', 'rename:dist']);
};