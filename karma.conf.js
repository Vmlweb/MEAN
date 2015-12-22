//Setup
module.exports = function(config) {
  config.set({
	  
	//Set relative directory and testing framework
  	basePath: '',
  	frameworks: ['mocha'],
  	plugins: [
  		'karma-mocha',
  		'karma-mocha-reporter',
  		'karma-phantomjs-launcher'
  	],
  	
  	//Dispaly verbose about each test executed
    reporters: ['mocha'],
    colors: true,
    logLevel: config.LOG_INFO,

  	//List of js files to incude and tests to execute
  	files: [
	    'public/libs/jquery.min.js',
	    'public/libs/angular.min.js',
	    'public/libs/angular-ui-router.min.js',
	    'public/libs/angular-mocks.js',
	    'public/libs/semantic.min.js',
	    'public/libs/chai.js',
	    'public/app.min.js',
		'client/**/*.mock.js',
		'client/**/*.stub.js',
		'client/**/*.test.js',
		'client/**/*.spec.js',
		'client/**/*.db.js'
    ],

	//List of files to exclude
    exclude: [],
    
    //Browsers to test
    browsers: ['PhantomJS'],

	//Execution configuration
    preprocessors: {},
    port: 9876,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
