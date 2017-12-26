(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;
                    myRyCore.registerEventListener(RYANCore.AD_PLAY, adPlayed, myRyCore);
                    myRyCore.registerEventListener(RYANCore.NO_AD, adFail, myRyCore);
                    myRyCore.registerEventListener(RYANCore.AD_COMPLETE, adFail, myRyCore);
                    myRyCore.registerEventHandler(RYANCore.HDESTROY, adDestroyed, myRyCore);
                    myRyCore.registerEventHandler(RYANCore.HCLOSE, adDestroyed, myRyCore);
                },
                "testName":"Close Ad",
                "AdObject":{"placeguid":"7980E58319",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                  }, 
                "runNumOfTimes":1,
                "maxRuntime":30000
                });
    function adPlayed(event) {
        myRyCore.closeAd();
    }
    function adDestroyed(event) {
        _testState.createReport(true, "");
    }
    function adFail(event) {
        _testState.createReport(false, "", "Ad Failed to load!");
    }
})();