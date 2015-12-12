var path = require('path');
var moment = require('moment');

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
		            src: ['app/**/**.*', 'libs/**/**.*', 'config/**/**.*', 'Dockerfile', 'app.js', 'package.json'],
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
							dir: path.dirname(dest).replace('dist/','') + '/'
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
							dir: path.dirname(dest).replace('public/','') + '/'
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
		        tasks: ['html:dev', 'start:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    css: {
		        files: 'src/**/*.styl',
		        tasks: ['css:dev', 'start:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    js: {
		        files: 'src/**/*.js',
		        tasks: ['js:dev', 'start:dev'],
		        options: {
		            spawn: false
		        }
		    },
		    app: {
		        files: ['app/**/*.js', 'app.js', 'config/*.conf'],
		        tasks: ['start:dev'],
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
		
		//Run shell tasks
		shell: {
			dist: {
				
				//Install production modules before archiving
				command: 'cd dist && npm install --production'
			},
			libs: {
				
				//Build libraries before copying to /libs/
				command: 'cd semantic && gulp build'
			}
		},
		
		//Run unit test instances
		mochaTest: {
			test: {
				src: ['tests/**/*.js']
			}
		}
	});
  
	//Load Tasks
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
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	//Web Server Tasks
	grunt.registerTask(':restartdev', ['stop:dev', 'start:dev']);
	grunt.registerTask('start:dev', ['express:dev']);
	grunt.registerTask('stop:dev', ['express:dev:stop']);
	
	//Development Tasks
	grunt.registerTask('js:dev', ['ngAnnotate:dev', 'uglify:dev']);
	grunt.registerTask('css:dev', ['stylus:dev', 'postcss:dev']);
	grunt.registerTask('html:dev', ['jade:dev']);
	grunt.registerTask('build:dev', ['copy:dev', 'html:dev', 'css:dev', 'js:dev']);
	
	//Distribution Tasks
	grunt.registerTask('js:dist', ['ngAnnotate:dist', 'uglify:dist']);
	grunt.registerTask('css:dist', ['stylus:dist', 'postcss:dist']);
	grunt.registerTask('html:dist', ['jade:dist']);
	grunt.registerTask('build:dist', ['copy:dist', 'html:dist', 'css:dist', 'js:dist']);
	
	//Main Tasks
	grunt.registerTask('default', ['dev']);
	grunt.registerTask('test', ['clean:dev', 'build:dev', 'start:dev', 'mochaTest:test']);
	grunt.registerTask('libs', ['clean:libs', 'shell:libs', 'copy:libs']);
	grunt.registerTask('dev', ['clean:dev', 'build:dev', 'start:dev', 'watch']);
	grunt.registerTask('dist', ['clean:dist', 'build:dist', 'shell:dist', 'compress:dist', 'rename:dist']);
};
