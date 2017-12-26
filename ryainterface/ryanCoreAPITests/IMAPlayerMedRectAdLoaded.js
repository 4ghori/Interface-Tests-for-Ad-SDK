(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
                    _testState = testState;
                    myRyCore = testState.lib;
                    // This needs to be set in order to load the local ima player
                    myRyCore.setDataProperty('assetPath','local');

                    myRyCore.registerEventListener(RYANCore.NO_AD, adFail, myRyCore);
                    myRyCore.registerEventListener(RYANCore.AD_PLAY, adSuccess, myRyCore);
                },
                "testName":"IMA Player Medium Rectangle Ad Loaded",
                "AdObject":{"placeguid":"1C1CE58663",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                },
                "runNumOfTimes":1,
                "maxRuntime":75000
                });

    function adSuccess(event) {
        _testState.createReport(true, "");
    }
    function adFail(event) {
        _testState.createReport(false, "", "Error unexpected NO-AD!!");
    }
})();