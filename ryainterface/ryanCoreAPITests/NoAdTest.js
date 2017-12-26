(function() {
	var _testState = undefined;
    var myRyCore = undefined;
	setValues({ "initializeCallback": function(testState) {
					_testState=testState;
                    myRyCore = testState.lib;
					myRyCore.registerEventListener(RYANCore.NO_AD, NoAdFired, myRyCore);
	                myRyCore.registerEventListener(RYANCore.AD_COMPLETE, OtherThingsFired, myRyCore);
				},
				"testName":"No Ad",
				"AdObject":{"placeguid":"E09AC58647",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                  }, 
				"runNumOfTimes":1,
				"maxRuntime":45000
				});
	function NoAdFired(event) {
		_testState.createReport(true, "");
	}
	function OtherThingsFired(event) {
		_testState.createReport(false, "", event.event + " Fired!");
	}
})();