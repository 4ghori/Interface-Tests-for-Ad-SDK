(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    var myTestData = dealTestData.validDeal[0];
    var _adObject = {};
    var _primaryAdObject = {   
        "placeguid": "44E2758743",
        "nameSpace":'ryCore',
        "containerId":'AdDiv',
        "adServerDomain": _getRemoteDomain(),
        "lib" : { deal : myTestData.deal }
    };
    var _secondaryAdObject = {
        "placeguid": "44E2758743",
        "nameSpace":'ryCore',
        "containerId":'AdDiv',
        "autoHide":false,
        "adServerDomain": _getRemoteDomain(),
        "lib" : { deal : myTestData.deal }
    };
    var _adObject = _primaryAdObject;
    var testFailed = false;
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;

                    myRyCore.registerEventHandler(RYANCore.HINITIALIZED, checkAutoHide);
                },
                "preInitializationCallback": function(testCount) {
                    if (testCount == 1) {
                        this.AdObject = _primaryAdObject;
                    } else {
                        this.AdObject = _secondaryAdObject;
                    }
                },
                "testName":"Deal Auto Hide",
                "AdObject": _adObject,
                "customLoad" : loadDeal,
                "runNumOfTimes": 2,
                "maxRuntime":15000
                });
    function loadDeal(event) {
        try {
            myRyCore.deal();
        } catch(e) {}
    }
    function checkAutoHide() {
        if (myRyCore.autoHide == true) {
            _testState.createReport(true, "");
        } else {
            _testState.createReport(false, "", "Auto Hide not initialized!");
        }
    }
})();