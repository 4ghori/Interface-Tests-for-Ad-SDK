(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    var _placeguids = [ "AE46F58646", "F7B4F58641" ];
    var _adObject = { "placeguid": _placeguids[0],
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                  };
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;
                    myRyCore.registerEventListener(RYANCore.AD_PLAY, adPlayed, myRyCore);
                    myRyCore.registerEventListener(RYANCore.NO_AD, adFail, myRyCore);
                    myRyCore.registerEventHandler(RYANCore.HDESTROY, adDestroyed, myRyCore);
                    myRyCore.registerEventHandler(RYANCore.HCLOSE, adDestroyed, myRyCore);
                },
                "preInitializationCallback": function(testCount) {
                    _adObject.placeguid = _placeguids[ testCount - 1 ];
                },
                "testName":"Close Ad On Complete",
                "AdObject":_adObject, 
                "runNumOfTimes":2,
                "maxRuntime":50000
                });
    function adPlayed(event) {
    }
    function adDestroyed(event) {
        _testState.createReport(true, "");
    }
    function adFail(event) {
        _testState.createReport(false, "", "Ad Failed to load!");
    }
})();