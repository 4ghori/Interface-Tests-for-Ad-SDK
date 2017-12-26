(function() {
    var testParams;
    var eventCount;
    var _testState = undefined;
    var myRyCore = undefined;
    var _placeguids = [ "4D2B658660","D077B58787" ];
    var _adObject = {"placeguid":_placeguids[0],
                    "nameSpace":'ryCore',
                    "containerId":'AdDiv',
                    'autoHide':true,
                    "adServerDomain": _getRemoteDomain(),
                    "adsRpcConnectorId": 'ryCore'
                  };
    setValues({ "initializeCallback": function(testState) {
                    _testState=testState;
                    myRyCore = testState.lib;
                    eventCount = 0;
                    testParams = {
                        "EventListener: setAttributes": {called:0, expected:"any"},
                        "EventListener: page_load": {called:0, expected:1},
                        "EventListener: load": {called:0, expected:1},
                        "EventListener: play": {called:0, expected:1},
                        "EventHandler: handler_module_load" : {called:0, expected:"lib"},
                        "EventHandler: handler_module_initialized" : {called:0, expected:"lib"},
                        "EventHandler: handler_module_complete" : {called:0, expected:"lib"},
                        "EventHandler: handler_initialized" : {called:0, expected:1},
                        "EventHandler: handler_load": {called:0, expected:1},
                        "EventHandler: handler_ready": {called:0, expected:1},
                        "EventHandler: handler_create": {called:0, expected:1},
                        "EventHandler: handler_version": {called:0, expected:1},
                        "EventHandler: handler_destroy": {called:0, expected:1},
                        "PreEventHandler: handler_destroy" : {called:0, expected:1},
                        "PostEventHandler: handler_destroy": {called:0, expected:1},
                    };

                    var events = EventsAndHandlersManager.getEventLists();
                    for(var eventsIndex in events ) {
                        var event = events[eventsIndex];
                        myRyCore.registerEventListener(events[eventsIndex], createHandlerClosure(event,"EventListener"), myRyCore);
                    }

                    var handlers = EventsAndHandlersManager.getHandlerLists();
                    for(var handlersIndex in handlers ) {
                        var handler = handlers[handlersIndex];
                        myRyCore.registerPreEventHandler(handler, createHandlerClosure(handler,"PreEventHandler"), myRyCore);
                        myRyCore.registerEventHandler(handler, createHandlerClosure(handler,"EventHandler"), myRyCore)
                        myRyCore.registerPostEventHandler(handler, createHandlerClosure(handler,"PostEventHandler"), myRyCore);
                    }

                    myRyCore.registerEventListener(RYANCore.NO_AD, gatherReport, myRyCore);
                    myRyCore.registerPostEventHandler(RYANCore.HDESTROY, gatherReport, myRyCore);

                    setTimeout(function() {
                        myRyCore.Destroy();
                    }, 45000)
                },
                "preInitializationCallback": function(testCount) {
                    _adObject.placeguid = _placeguids[ testCount - 1 ];
                },
                "testName":"Medium Rectangle",
                "AdObject": _adObject,
                "runNumOfTimes": _placeguids.length,
                "maxRuntime":60000
            });
    
    function createHandlerClosure(handler,functionType) {
        var handlerName = handler, callbackType = functionType;
        
        return function (event) {
            eventCount++;

            var explicitEvent = callbackType + ": " + event.event;
            if (explicitEvent in testParams) {
                testParams[explicitEvent].called++;
            } else {
                testParams[explicitEvent] = {called:0, expected:0};
            }
        };
    }
    function gatherReport(event)
    {   
        var outputArray = verifyEvents.call(this);
        var passed = true;
        if (outputArray.length > 0) {
            passed = false;
        }
        _testState.createReport(passed, ("(" + eventCount + " events)"), outputArray.join("<br>"));
    }
    function verifyEvents() {
        return verifyEventObjects.call(this,testParams);
    }
})();
