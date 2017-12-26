(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    var myTestData = dealTestData.invalidDealPlaceguid[0];
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

                    EventsAndHandlersManager.addEventLists(RYANDeal.publicEvents);
                    EventsAndHandlersManager.addHandlerLists(RYANDeal.publicHandlers);

                    myRyCore.registerEventListener(RYANCore.NO_AD,dealFailure,myRyCore);

                    try {
                        myRyCore.registerEventHandler(RYANDeal.HDEAL,dealResponseHandler,myRyCore);
                    } catch(e) {
                        testFailed = true;
                        _testState.createReport(false, "", "Missing imported handler 'HDEAL'");
                    }

                    try {
                        myRyCore.registerEventListener(RYANDeal.ENABLEREWARD,dealFailure,myRyCore);
                    } catch(e) {
                        testFailed = true;
                        _testState.createReport(false, "", "Missing imported event 'ENABLEREWARD'");
                    }
                },
                "preInitializationCallback": function(testCount) {
                    myTestData = dealTestData.invalidDealPlaceguid[ testCount - 1 ];
                    _adObject.placeguid = myTestData.placeguid;
                    _adObject.lib = { deal : myTestData.deal };
                },
                "testName":"Deal No Ad",
                "AdObject": _adObject,
                "customLoad" : loadDeal,
                "runNumOfTimes":dealTestData.invalidDealPlaceguid.length,
                "maxRuntime":45000
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
        var hasDeal = data.hasDeal
        if(hasDeal !== false) {
            testFailed = true;
            _testState.createReport(false, "", "Unexpected 'Ad available' from server after deal check");
        } else if( testFailed == false ) {
            // passed load ad
            _testState.createReport(true, "");
        }
    }
    function dealFailure(event) {
        _testState.createReport(false, "", "Unexpected handler events called " + event.event);
    }
})();