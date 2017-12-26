(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
                    _testState = testState;
                    myRyCore = testState.lib;
                    // This needs to be set in order to load the local ima player
                    myRyCore.setDataProperty('assetPath','local');

                    myRyCore.registerEventListener(RYANCore.NO_AD, adFail, myRyCore);
                    myRyCore.registerEventListener(RYANCore.AD_COMPLETE, adSuccess, myRyCore);
                },
                "testName":"IMA Player Ad Loaded",
                "AdObject":{"placeguid":"7C72558718",
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                },
                "runNumOfTimes":1,
                "maxRuntime":60000
                });

    function adSuccess(event) {
        _testState.createReport(true, "");
    }
    function adFail(event) {
        _testState.createReport(false, "", "Error unexpected NO-AD!!");
    }
})();