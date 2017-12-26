(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
                    _testState = testState;
                    myRyCore = testState.lib;
                    // This needs to be set in order to load the local ima player
                    myRyCore.setDataProperty('assetPath','local');

                    myRyCore.registerEventListener(RYANCore.NO_AD, adSuccess, myRyCore);
                    myRyCore.registerEventListener(RYANCore.AD_COMPLETE, adFail, myRyCore);
                },
                "testName":"IMA Player All No Ads",
                "AdObject":{"placeguid":"177DD58744",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                },
                "runNumOfTimes":1,
                "maxRuntime":45000
                });

    function adSuccess(event) {
        _testState.createReport(true, "");
    }
    function adFail(event) {
        _testState.createReport(false, "", "Error unexpected Ad Load");
    }
})();