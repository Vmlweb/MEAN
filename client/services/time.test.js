//Test
describe('Time Service', function(){
	var TimeService, httpBackend;
	
	//Inject dependancies for testing
	beforeEach(inject(function(_TimeService_, $httpBackend) {
		TimeService = _TimeService_;
		httpBackend = $httpBackend;
	}));
	
	//Make sure no requests have been left unfullfilled
	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	//Perform tests	
	it("should return time", function (done) {
		
		//Create stub http response
		httpBackend.expectGET("/api/time").respond({
			time: 'Sunday, December 12th 2012, 12:12:12 am'
		});
		
		//Get current time from service
		TimeService.getTime(function(time){
			
			//Check correct response
			expect(time).to.equal('Sunday, December 12th 2012, 12:12:12 am');
			
			done();
		});
		
		//Flush any request data
		httpBackend.flush();
	});
});