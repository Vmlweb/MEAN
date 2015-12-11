var path = require('path');
var moment = require('moment');

module.exports = function(grunt) {

	//Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		//Clean
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
	
	    //Copy
	    copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src',
		            src: ['**', '!**/*.js', '!**/*.styl', '!**/*.jade'],
		            dest: 'dist'
				},{
					expand: true,
		            src: 'Dockerfile',
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
		            src: ['**/*.min.js'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'node_modules/angular-route',
		            src: ['**/*.min.js'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'node_modules/jquery/dist',
		            src: ['**/*.min.js'],
		            dest: 'libs'
		        },{
					expand: true,
					cwd: 'semantic/dist',
		            src: ['**/*.min.js', '**/*.min.css', '!**/components/*.*'],
		            dest: 'libs'
		        }]
	        }
	    },
		
		//HTML
    	jade: {
			dist: {
				options: {
			    	data: function(dest, src){
				    	return {
							dir: path.dirname(dest).replace('dist/','') + '/'
						};
			    	}	
		    	},
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.jade', '!**/*.inc.jade'],
					dest: 'dist',
					ext: '.html'
				}]
			},
			dev: {
				options: {
			    	data: function(dest, src){
				    	return {
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

		//CSS
		stylus: {
			dist: {
				files: {
					'dist/app.min.css': ['src/**/*.styl']
				}
			},
			dev: {
				files: {
					'public/app.min.css': ['src/**/*.styl']
				}
			}
		},
		postcss: {
			dist: {
				files: {
					'dist/app.min.css': 'dist/app.min.css'
				}
			},
			dev: {
				files: {
					'public/app.min.css': 'public/app.min.css'
				}
			}
		},
		
		//Angular
		ngmin: {
			dist: {
				files: [{
					'dist/app.min.js': ['src/app.js', 'src/**/*.js']
				}]
			},
			dev: {
				files: [{
					'public/app.min.js': ['src/app.js', 'src/**/*.js']
				}]
			}
		},
		
		//JS
		uglify: {
			dist: {
				options: {
					banner: '(function(){',
					footer: '})();',
					mangle: false
				},
				files: [{
					'dist/app.min.js': 'dist/app.min.js'
				}]
			},
			dev: {
				options: {
					banner: '(function(){',
					footer: '})();',
					mangle: false
				},
				files: [{
					'public/app.min.js': 'public/app.min.js'
				}]
			}
    	},
		
		//Watch
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
		        files: ['app/**/*.js', '*.js', '*.conf'],
		        tasks: ['build:dev', 'start:dev'],
		        options: {
		            spawn: false
		        }
		    }
		},
		
		//Express
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
		
		//Compress
		compress: {
			dist: {
				options: {
					archive: 'dist/dist.tar.gz',
					mode: 'tgz'
			    },
			    files: [{
				    expand: true,
					cwd: 'dist',
					src: ['**']
			    }]
			}
		},
		
		//Rename Compressed
		rename: {
			dist: {
			    files: [{
					src: 'dist/dist.tar.gz',
					dest: 'dist/dist_' + moment().format() + '.tar.gz'
			    }]
			}
		},
		
		//Libs
		shell: {
			libs: {
				command: 'cd semantic && gulp build'
			}
		},
	});
  
	//Dev Tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-gulp');
	grunt.loadNpmTasks('grunt-shell');
	
	//Dist Tasks
	grunt.loadNpmTasks('grunt-contrib-compress');
	
	//Server Tasks
	grunt.registerTask('restart:dev', ['stop:dev', 'start:dev']);
	grunt.registerTask('start:dev', ['express:dev']);
	grunt.registerTask('stop:dev', ['express:dev:stop']);
	
	//Dev Tasks
	grunt.registerTask('js:dev', ['ngmin:dev', 'uglify:dev', 'uglify:dev']);
	grunt.registerTask('css:dev', ['stylus:dev', 'postcss:dev']);
	grunt.registerTask('html:dev', ['jade:dev']);
	grunt.registerTask('build:dev', ['copy:dev', 'html:dev', 'css:dev', 'js:dev']);
	
	//Dist Tasks
	grunt.registerTask('js:dist', ['ngmin:dist', 'uglify:dist', 'uglify:dist']);
	grunt.registerTask('css:dist', ['stylus:dist', 'postcss:dist']);
	grunt.registerTask('html:dist', ['jade:dist']);
	grunt.registerTask('build:dist', ['copy:dist', 'html:dist', 'css:dist', 'js:dist']);
	
	//Main Tasks
	grunt.registerTask('default', ['dev']);
	grunt.registerTask('libs', ['clean:libs', 'shell:libs', 'copy:libs']);
	grunt.registerTask('dev', ['clean:dev', 'build:dev', 'start:dev', 'watch']);
	grunt.registerTask('dist', ['clean:dist', 'build:dist', 'compress:dist', 'rename:dist']);
};
