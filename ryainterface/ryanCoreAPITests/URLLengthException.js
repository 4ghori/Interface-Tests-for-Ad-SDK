(function() {
    var _testState = undefined;
    setValues({ "initializeCallback": function(testState) {
                _testState=testState;
                myRyCore = testState.lib;

                var longString = "";
                var appendString = "Testabc123"
                for (var x = 0; x < 205; x++) {
                    longString += appendString;
                }
                myRyCore.setDataProperty("test", longString);
                myRyCore.registerEventHandler(RYANCore.HEXCEPTION, checkExceptionEvent, myRyCore, RYANCore.HFLAG_EXECUTE_ONCE);
            },
            "testName":"URL Length Exception",
            "AdObject":{"placeguid":"FA81C58619", 
                        "nameSpace":'ryCore', 
                        "containerId":'AdDiv', 
                        "adServerDomain": _getRemoteDomain(),
                        "autoHide":true
                    }, 
            "runNumOfTimes":1, 
            "maxRuntime":45000
            }
        );
    function checkExceptionEvent(event, data) {
        setTimeout(function() {
            if (data && data.data && data.data.indexOf("Maximum url string length reached!") > -1) {
                _testState.createReport(true,"");
            } else {
                _testState.createReport(false,"", data.data ? data.data : "" );
            }
        }.bind(this), 0);
    }
})();