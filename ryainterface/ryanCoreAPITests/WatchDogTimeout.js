(function() {
    var _testState = undefined;
    var testComplete = false;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;
                    testComplete = false;
                    myRyCore.registerEventListener(RYANCore.NO_AD, NoAdFired, myRyCore);
                    myRyCore.registerEventListener(RYANCore.AD_COMPLETE, OtherThingsFired, myRyCore);
                },
                "testName":"Watch Dog Timeout",
                "AdObject":{"placeguid":"BD33E58620",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    'remoteUrl':"KillAdTimerTest",
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                  }, 
                "runNumOfTimes":1,
                "maxRuntime":45000
                });
    function NoAdFired(event) {
        testComplete = true;
        _testState.createReport(true, "");
    }
    function OtherThingsFired(event) {
        if (!testComplete) {
            _testState.createReport(false, "", event.event + " Fired!");
        }
    }
})();
