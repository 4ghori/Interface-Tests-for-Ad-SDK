(function() {
	var _testState;
	var myRyCore = undefined;
	function EventSuccessHandler(event) {
		_testState.createReport(true, "");
	}
	function EventFailureHandler(event) {
		_testState.createReport(false, "", event.event + " Fired!");
	}
	function loadAd(lib) {
		lib.loadAd();
	}
	var _testState = undefined;
	setValues({ "initializeCallback": function(testState) {
					_testState=testState;
					myRyCore = testState.lib;
					myRyCore.registerEventListener(RYANCore.NO_AD, EventSuccessHandler, myRyCore);
	                myRyCore.registerEventListener(RYANCore.AD_PLAY, EventFailureHandler, myRyCore);
	                myRyCore.registerEventListener(RYANCore.AD_LOAD, EventFailureHandler, myRyCore);
	               	myRyCore.registerEventListener(RYANCore.AD_COMPLETE, EventFailureHandler, myRyCore);
				},
				"testName":"Server No Ad Response",
			    "AdObject":{"placeguid":"ABCDE01234", "nameSpace":'ryCore',
						"containerId":'AdDiv', "autoHide":true,
						"adServerDomain": _getRemoteDomain() 
					}, 
			    "runNumOfTimes":1, 
			    "customLoad":loadAd,
			    "maxRuntime":45000
			});
})();