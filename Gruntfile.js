var path = require('path');
var moment = require('moment');
var name = require('./package.json').name;
var dataPath = path.join(__dirname, 'data');

module.exports = function(grunt) {

	//Configure Grunt Tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		//Clean directories before task execution
		clean: {
			dist: {
				expand: true,
				cwd: 'dist',
				src: ['**']
			},
			dev: {
				expand: true,
				cwd: 'public',
				src: ['**']
			},
			libs: {
				expand: true,
				src: ['libs/**', 'semantic/dist/**']
			}
		},
	
	    //Copy files from source to build directories
	    copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src',
		            src: ['**', '!**/*.js', '!**/*.styl', '!**/*.jade'],
		            dest: 'dist/public'
				},{
					expand: true,
		            src: ['api/**/**.*', 'app/**/**.*', 'classes/**/**.*', 'libs/**/**.*', 'config/**/**.*', 'data', 'logs', 'Dockerfile', 'app.js', 'package.json'],
		            dest: 'dist'
				}]
	        },
	        dev: {
				expand: true,
				cwd: 'src',
	            src: ['**', '!**/*.js', '!**/*.styl', '!**/*.jade'],
	            dest: 'public'
	        },
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
	        }
	    },
		
		//Compile Jade files into HTML
    	jade: {
			dist: {
				options: {
			    	data: function(dest, src){
				    	return {
					    	
					    	//Inject relative directory into Jade templates and can be accessed via {dir}
							dir: path.dirname(dest).replace('dist/public','')
						};
			    	}	
		    	},
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.jade', '!**/*.inc.jade'],
					dest: 'dist/public',
					ext: '.html'
				}]
			},
			dev: {
				options: {
			    	data: function(dest, src){
				    	return {
							
							//Inject relative directory into Jade templates and can be accessed via {dir}
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
			dist: {
				files: {
					'dist/public/app.min.css': ['src/**/*.styl']
				}
			},
			dev: {
				files: {
					'public/app.min.css': ['src/**/*.styl']
				}
			}
		},
		
		//Append CSS prefixes onto minified CSS files
		postcss: {
			dist: {
				files: {
					'dist/public/app.min.css': 'dist/public/app.min.css'
				}
			},
			dev: {
				files: {
					'public/app.min.css': 'public/app.min.css'
				}
			}
		},
		
		//Concatenate javascript files using an Angular safe layout
		ngAnnotate: {
			dist: {
				files: [{
					'dist/public/app.min.js': ['src/app.js', 'src/**/*.js']
				}]
			},
			dev: {
				files: [{
					'public/app.min.js': ['src/app.js', 'src/**/*.js']
				}]
			}
		},
		
		//Minify concatenated javascript files
		uglify: {
			dist: {
				options: {
					mangle: false
				},
				files: [{
					'dist/public/app.min.js': 'dist/public/app.min.js'
				}]
			},
			dev: {
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
		    test: {
		        files: ['tests/**/*.js'],
		        tasks: ['mochaTest:test'],
		        options: {
		            spawn: true
		        }
		    }
		},
		
		//Express development web server
		express: {
		    dist: {
		        options: {
		            script: 'app.js',
		            node_env: 'production'
		        }
		    },
		    dev: {
		        options: {
		            script: 'app.js',
		            node_env: 'development'
		        }
		    }
		},
		
		//Archive distribution build into .tar.gz
		compress: {
			dist: {
				options: {
					archive: 'dist/dist.tar.gz',
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
		
		//Append timestamp onto archived distribution build
		rename: {
			dist: {
			    files: [{
					src: 'dist/dist.tar.gz',
					dest: 'dist/dist_' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.tar.gz'
			    }]
			}
		},
		
		//Shell tasks
		shell: {
			
			//Shell tasks for building
			dist: {
				
				//Make shell files executable when building
				command: 'cd dist && chmod +x server.sh && ./server.sh build',
				options: {
					async: false
				}
			},
			libs: {
				
				//Build libraries before copying to /libs/
				command: 'cd semantic && gulp build',
				options: {
					async: false
				}
			},
			
			//Start development server in docker
			chmod: {
				command: 'chmod +x server.sh'
			},
			dev: {
				command: './server.sh dev ' + name.toLowerCase(),
				options: {
					async: true,
			        stdout: true,
			        stderr: true
				}
			},
			mock: {
				command: 'node ./mocks/index.js',
				options: {
					async: false,
			        stdout: true,
			        stderr: true
				}
			},
			test: {
				command: './server.sh mock ' + name.toLowerCase(),
				options: {
					async: true,
			        stdout: true,
			        stderr: true
				}
			},
			stop: {
				command: './server.sh stop ' + name.toLowerCase(),
				options: {
					async: false,
					failOnError: false,
					stderr: false
				}
			},
		},
		
		//Run unit test instances
		mochaTest: {
			test: {
				src: ['tests/**/*.js']
			}
		},
		
		//Wait for 2 seconds before test starts
		wait: {
			test: {
				options: {
					delay: 2000
				}
			}
		},
		
		//Replace string in builds
		replace: {
			dist: {
				options: {
					patterns: [{
						match: 'NAME',
						replacement: name.toLowerCase()
					}]
				},
				files: [{
					expand: true,
					flatten: true,
		            src: ['server.sh', 'docker-compose.yml',],
		            dest: 'dist'
				}]
			}
		}
	});
  
	//Load Tasks
	grunt.loadNpmTasks('grunt-wait');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-replace');
	
	//Development Tasks
	grunt.registerTask('js:dev', ['ngAnnotate:dev', 'uglify:dev']);
	grunt.registerTask('css:dev', ['stylus:dev', 'postcss:dev']);
	grunt.registerTask('html:dev', ['jade:dev']);
	grunt.registerTask('build:dev', ['copy:dev', 'html:dev', 'css:dev', 'js:dev']);
	
	//Distribution Tasks
	grunt.registerTask('js:dist', ['ngAnnotate:dist', 'uglify:dist']);
	grunt.registerTask('css:dist', ['stylus:dist', 'postcss:dist']);
	grunt.registerTask('html:dist', ['jade:dist']);
	grunt.registerTask('build:dist', ['copy:dist', 'replace:dist', 'html:dist', 'css:dist', 'js:dist', 'libs', 'shell:dist']);
	
	//Server Tasks
	grunt.registerTask('server:dev', ['shell:chmod' ,'server:stop', 'shell:dev']);
	grunt.registerTask('server:mock', ['shell:chmod' ,'server:stop', 'shell:test', 'wait:test', 'shell:mock']);
	grunt.registerTask('server:stop', ['shell:stop']);
	
	//Main Tasks
	grunt.registerTask('default', ['dev']);
	grunt.registerTask('stop', ['server:stop']);
	grunt.registerTask('test', ['clean:dev', 'build:dev', 'server:mock', 'mochaTest:test', 'server:stop']);
	grunt.registerTask('libs', ['clean:libs', 'shell:libs', 'copy:libs']);
	grunt.registerTask('dev', ['clean:dev', 'build:dev', 'server:dev', 'watch', 'server:stop']);
	grunt.registerTask('dist', ['server:stop', 'clean:dist', 'build:dist', 'compress:dist', 'rename:dist']);
};
