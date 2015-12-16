//Modules
var path = require('path');
var moment = require('moment');
var name = require('./package.json').name.toLowerCase();

//Configs
var mongoConfig = require(path.join(__dirname,'config', 'mongo.js'));
var loggerConfig = require(path.join(__dirname,'config', 'logger.js'));

//Create names
var appName = name + '_app';
var dbName = name + '_db';

//Setup server
var setupServer = [
	'docker pull mongo',
	'docker pull node:slim'
]

//Build libs
var buildLibs = [
	'cd semantic',
	'gulp build'
]

//Reset database
var resetDatabase = [
	'rm -r $PWD/data',
	'mkdir $PWD/data',
	'rm -r $PWD/logs',
	'mkdir $PWD/logs',
	'docker run --name ' + dbName + '_dev -d -v $PWD/data:/data/db -v $PWD/Mongo.js:/home/Mongo.js -w /home mongo mongod --auth',
	'docker exec -i ' + dbName + '_dev mongo < ./Mongo.js',
	'docker stop ' + dbName + '_dev',
	'docker rm ' + dbName + '_dev'
]

//Development server
var devServer = [
	'docker run --name ' + dbName + '_dev -d -p 27017:27017 -v $PWD/data:/data/db -w /home mongo mongod --auth',
	'docker run --name ' + appName + '_dev -p 80:8080 -p 443:4434 -v $PWD:/home -w /home --link ' + dbName + '_dev:mongo -t node:slim node app'
]

//Test server
var testServer = [
	'docker run --name ' + dbName + '_test -d -p 27017:27017 -v $PWD/mocks:/home/mocks -v $PWD/Mongo.js:/home/Mongo.js -w /home mongo mongod --auth',
	'docker exec -i ' + dbName + '_test mongo < ./Mongo.js',
	'find ./mocks -type f -exec docker exec ' + dbName + '_test mongoimport -u ' + mongoConfig.connection.user + ' -p ' + mongoConfig.connection.password + ' --authenticationDatabase ' + mongoConfig.connection.database + ' --db ' + mongoConfig.connection.database + ' --file "/home/{}" --jsonArray \\;',
	'docker run --name ' + appName + '_test -p 80:8080 -p 443:4434 -v $PWD:/home -w /home --link ' + dbName + '_test:mongo -t node:slim node app'
]

//Stop server
var stopDev = [
	'docker stop ' + dbName + '_dev',
	'docker rm ' + dbName + '_dev',
	'docker stop ' + appName + '_dev',
	'docker rm ' + appName + '_dev'
]
var stopTest = [
	'docker stop ' + dbName + '_test',
	'docker rm ' + dbName + '_test',
	'docker stop ' + appName + '_test',
	'docker rm ' + appName + '_test'
]

//Build distribution
var buildDist = [
	'docker build -t ' + appName + ' -f Dockerfile.node $PWD',
	'docker build -t ' + dbName + ' -f Dockerfile.mongo $PWD',
	'cd dist',
	'docker save ' + dbName + ' ' + appName + ' > ' + name + '.tar'
]

module.exports = function(grunt) {

	//Configure Grunt Tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		//Clean directories before task execution
		clean: {
			libs: {
				expand: true,
				src: ['libs/**']
			},
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
		    
		    //Copy web frameworks into /libs/ folder
	        libs: {
		        files: [{
					expand: true,
					cwd: 'node_modules/angular',
		            src: ['**/*.min.js', '**/*.min.js.map'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'node_modules/angular-route',
		            src: ['**/*.min.js', '**/*.min.js.map'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'node_modules/jquery/dist',
		            src: ['**/*.min.js', '**/*.min.map'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'semantic/dist',
		            src: ['**/*.min.js', '**/*.min.css', '!**/components/*.*', 'themes/**/*.*'],
		            dest: 'libs'
		        }]
	        },
	        
	        //Copy non-compile files from /source/ to /public/
	        build: {
				expand: true,
				cwd: 'src',
	            src: ['**', '!**/*.js', '!**/*.styl', '!**/*.jade'],
	            dest: 'public'
	        }
	    },
		
		//Compile Jade files into HTML
    	jade: {
			build: {
				options: {
			    	data: function(dest, src){
				    	return {
							
							//Inject path into template which can be accessed via {dir}
							//Used to access files in a relative directory
							dir: path.dirname(dest).replace('public','')
						};
			    	}
		    	},
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.jade', '!**/*.inc.jade'],
					dest: 'public',
					ext: '.html'
				}]
			}
		},

		//Compile and minify Stylus files into CSS
		stylus: {
			build: {
				files: {
					'public/app.min.css': ['src/**/*.styl']
				}
			}
		},
		
		//Append CSS prefixes onto minified CSS files
		postcss: {
			build: {
				files: {
					'public/app.min.css': 'public/app.min.css'
				}
			}
		},
		
		//Concatenate JS files using an AngularJS safe format
		ngAnnotate: {
			build: {
				files: [{
					'public/app.min.js': ['src/app.js', 'src/**/*.js']
				}]
			}
		},
		
		//Minify concatenated JS files
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: [{
					'public/app.min.js': 'public/app.min.js'
				}]
			}
    	},
		
		//Watch for any file changes to reload the server
		watch: {
		    options: {
				livereload: true
		    },
		    html: {
		        files: 'src/**/*.jade',
		        tasks: ['html:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    css: {
		        files: 'src/**/*.styl',
		        tasks: ['css:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    js: {
		        files: 'src/**/*.js',
		        tasks: ['js:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    app: {
		        files: ['app/**/*.*', 'app.js', 'config/*.*', 'api/**/*.*', 'classes/**/*.*'],
		        tasks: ['server:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    
		    //Re-execute any test cases should those files change
		    test: {
		        files: ['tests/**/*.js'],
		        tasks: ['server:test', 'mochaTest:test', 'server:dev'],
		        options: {
		            spawn: true
		        }
		    }
		},
		
		//Archive distribution directory into .tar.gz
		compress: {
			dist: {
				options: {
					archive: 'dist/' + name + '_' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.tar.gz',
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
		
		//Shell tasks
		shell: {
			
			//Setup the enviroment first time
			setup: {
				command: setupServer.join(' && '),
				options: {
					async: false
				}
			},
			
			//Build web frameworks before moving to /libs/
			libs: {
				command: buildLibs.join(' && '),
				options: {
					async: false
				}
			},
			
			//Rese the development database
			reset: {
				command: resetDatabase.join(' && '),
				options: {
					async: false
				}
			},
			
			//Start and stop development server in docker
			dev: {
				command: devServer.join(' && '),
				options: {
					async: true
				}
			},
			stop_dev: {
				command: stopDev.join(' && '),
				options: {
					async: false,
					failOnError: false,
					stderr: false,
					stdout: false
				}
			},
			
			//Start and stop testing server in docker
			test: {
				command: testServer.join(' && '),
				options: {
					async: true
				}
			},
			stop_test: {
				command: stopTest.join(' && '),
				options: {
					async: false,
					failOnError: false,
					stderr: false,
					stdout: false
				}
			},
			
			//Make distribution build
			dist: {
				command: buildDist.join(' && '),
				options: {
					async: false
				}
			}
		},
		
		//Run automated unit tests
		mochaTest: {
			test: {
				src: ['tests/**/*.js']
			}
		},
		
		//Wait for 2 seconds before tests starts
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
		            src: ['server.sh', 'docker-compose.yml', 'Mongo.js'],
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
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-wait');
	
	//Build Tasks
	grunt.registerTask('build:js', ['ngAnnotate:build', 'uglify:build']);
	grunt.registerTask('build:css', ['stylus:build', 'postcss:build']);
	grunt.registerTask('build:html', ['jade:build']);
	grunt.registerTask('build', ['clean:build', 'copy:build', 'build:html', 'build:css', 'build:js']);
	
	//Workflow Tasks
	grunt.registerTask('libs', ['clean:libs', 'shell:libs', 'copy:libs']);
	grunt.registerTask('dev', ['build', 'server:dev', 'watch', 'server:stop']);
	grunt.registerTask('test', ['build', 'server:test', 'mochaTest:test', 'server:stop']);
	grunt.registerTask('dist', ['server:stop', 'libs', 'build', 'clean:dist', 'replace:dist', 'shell:dist']);
	grunt.registerTask('compress', ['compress:dist', 'rename:dist']);
	
	//Server Tasks
	grunt.registerTask('server:dev', ['server:stop', 'shell:dev']);
	grunt.registerTask('server:reset', ['server:stop', 'shell:reset']);
	grunt.registerTask('server:test', ['server:stop', 'shell:test', 'wait:test']);
	grunt.registerTask('server:stop', ['shell:stop_dev', 'shell:stop_test']);
	
	//Default Tasks
	grunt.registerTask('default', ['dev']);
	grunt.registerTask('stop', ['server:stop']);
	grunt.registerTask('reset', ['server:reset']);
	grunt.registerTask('setup', ['shell:setup', 'libs', 'reset']);
};