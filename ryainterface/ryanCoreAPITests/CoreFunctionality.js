(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    var _placeguids = [ "FA81C58619", "8C80D58782" ];
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
                    testParams = {
                        "EventListener: setAttributes": {called:0, expected:"any"},
                        "EventListener: page_load": {called:0, expected:1},
                        "EventListener: resize": {called:0, expected:1},
                        "EventListener: load": {called:0, expected:1},
                        "EventListener: play": {called:0, expected:1},
                        "EventListener: complete": {called:0, expected:1},
                        "EventHandler: handler_module_load" : {called:0, expected:"lib"},
                        "EventHandler: handler_module_initialized" : {called:0, expected:"lib"},
                        "EventHandler: handler_module_complete" : {called:0, expected:"lib"},
                        "EventHandler: handler_initialized" : {called:0, expected:1},
                        "EventHandler: handler_load": {called:0, expected:1},
                        "EventHandler: handler_ready": {called:0, expected:1},
                        "EventHandler: handler_create": {called:0, expected:1},
                        "EventHandler: handler_version": {called:0, expected:1},
                    }
                    eventCount = 0;

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
                    myRyCore.registerPostEventHandler(RYANCore.AD_COMPLETE, gatherReport, myRyCore);
                    myRyCore.registerPostEventHandler(RYANCore.HCLOSE, gatherReport, myRyCore);
                },
                "preInitializationCallback": function(testCount) {
                    _adObject.placeguid = _placeguids[ testCount - 1 ];
                },
                "testName":"Core Functionality",
                "AdObject": _adObject,
                "runNumOfTimes":2,
                "maxRuntime":45000
            });
    var testParams;
    var eventCount;
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
        var self = this;
        setTimeout(function() {
            var outputArray = verifyEvents.call(self);
            var passed = true;
            if (outputArray.length > 0) {
                passed = false;
            }
            _testState.createReport(passed, ("(" + eventCount + " events)"), outputArray.join("<br>"));
        }, 3000);
    }
    function verifyEvents() {
        // needs to be called with ryanCore object
        return verifyEventObjects.call(this,testParams );
    }
})();
