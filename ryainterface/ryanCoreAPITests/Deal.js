(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    var myTestData = dealTestData.validDeal[0];
    var _adObject = {   "placeguid": myTestData.placeguid,
                        "nameSpace":'ryCore',
                        "containerId":'AdDiv',
                        'autoHide':true,
                        "adServerDomain": _getRemoteDomain(),
                        "lib" : { deal : myTestData.deal }
                   };
    var testFailed = false;
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;

                    EventsAndHandlersManager.addEventLists( RYANDeal.publicEvents );
                    EventsAndHandlersManager.addHandlerLists( RYANDeal.publicHandlers );

                    myRyCore.registerPostEventHandler(RYANCore.HDESTROY,dealSuccess,myRyCore);
                    myRyCore.registerEventListener(RYANCore.NO_AD,dealFailure,myRyCore);

                    try {
                        myRyCore.registerEventHandler(RYANDeal.HDEAL,dealResponseHandler,myRyCore);
                    } catch(e) {
                        testFailed = true;
                        _testState.createReport(false, "", "Missing imported handler 'HDEAL'");
                    }

                    try {
                        myRyCore.registerEventListener(RYANDeal.ENABLEREWARD,dealSuccess,myRyCore);
                    } catch(e) {
                        testFailed = true;
                        _testState.createReport(false, "", "Missing imported event 'ENABLEREWARD'");
                    }
                },
                "preInitializationCallback": function(testCount) {
                    myTestData = dealTestData.validDeal[ testCount - 1 ];
                    _adObject.placeguid = myTestData.placeguid;
                    _adObject.lib = { deal : myTestData.deal };
                },
                "testName":"Deal",
                "AdObject": _adObject,
                "customLoad" : loadDeal,
                "runNumOfTimes": dealTestData.validDeal.length,
                "maxRuntime":180000
                });
    function loadDeal(event) {
        try {
            myRyCore.deal();
        } catch(e) {
            testFailed = true;
            _testState.createReport(false, "", "Missing imported function 'deal'");
        }
    }
    function dealResponseHandler(event,data) {
        var hasDeal = data.hasDeal;
        if(hasDeal !== true) {
            testFailed = true;
            _testState.createReport(false, "", "Unexpected 'No ad available' from server after deal check");
        } else if( testFailed == false ) {
            // passed load ad
            myRyCore.loadAd();
        }
    }
    function dealFailure(event) {
        _testState.createReport(false, "", "Unexpected Event " + event.event);
    }
    function dealSuccess(event) {
        if( testFailed === false ) {
            _testState.createReport(true, "");
        }
    }
})();