(function() {
    var _testState = undefined;
    var myRyCore = undefined;
    setValues({ "initializeCallback": function(testState) {
		_testState=testState;
        myRyCore = testState.lib;
        // the item was getting deleted which destroys the second round of testing
        itemObjects = JSON.parse(JSON.stringify(this.AdObject));
        myRyCore.registerEventHandler(RYANCore.HREADY, instanceReady, myRyCore);
        myRyCore.registerEventListener(RYANCore.PAGE_LOAD, completeTest, myRyCore);
    },
    "testName":"Configuration Interface", 
    "AdObject":{ 
    	"placeguid":"FA81C58619", "containerId":'AdDiv', 'autoHide':true, 
        'peerType':RYANCore.PUBLISHER, "adServerDomain": "ryadsdev2r.rockyou.com", 'killTimerTimeout':10000,
        "modalEnabled":true, "config":"config", "modules":"Modules", "loadedModules":"Loaded", 
        "modulesLoadedHandler":"NotNull","version":"overridden", "rpcType":"S",
        "dataProperties":"T", "eventListeners":"R", "eventHandlers":"I", "preEventHandlers":"N",
        "postEventHandlers":"G", "additionalPublisherDataProperties":["S", "T", "R", "I", "N", "G"],
        "lib":"TEST"
    },
    "runNumOfTimes":1,
    "maxRuntime":60000
});

    var itemObjects;
    function instanceReady(event) {
        if (myRyCore.placeguid == itemObjects["placeguid"]) {
            delete itemObjects["placeguid"];
        }
        if (myRyCore.containerId == itemObjects["containerId"]) {
            delete itemObjects["containerId"];
        }
        if (myRyCore.autoHide == itemObjects["autoHide"]) {
            delete  itemObjects["autoHide"];
        }
        if (myRyCore.peerType == itemObjects["peerType"]) {
            delete itemObjects["peerType"];
        }
        if (myRyCore.remoteUrl == itemObjects["remoteUrl"]) {
            delete itemObjects["remoteUrl"];
        }
        if (myRyCore.killTimerTimeout == itemObjects["killTimerTimeout"]) {
            delete itemObjects["killTimerTimeout"];
        }
        if (myRyCore.modalEnabled == itemObjects["modalEnabled"]) {
            delete itemObjects["modalEnabled"];
        }
        if (myRyCore.config.lib == itemObjects["lib"]) {
            delete itemObjects["lib"];    
        }


        if (myRyCore.config != itemObjects["config"]) {
            delete itemObjects["config"];
        }
        if (myRyCore.modules != itemObjects["modules"]) {
            delete itemObjects["modules"];
        }
        if (myRyCore.loadedModules != itemObjects["loadedModules"]) {
            delete itemObjects["loadedModules"];
        }
        if (myRyCore.modulesLoadedHandler != itemObjects["modulesLoadedHandler"]) {
            delete itemObjects["modulesLoadedHandler"];
        }


        // changed, unit testing needed to override this value
        if (myRyCore.version == itemObjects["version"]) {
            delete itemObjects["version"];
        }
        if (myRyCore.rollCurrent != itemObjects["rollCurrent"]) {
            delete itemObjects["rollCurrent"];
        }
        if (myRyCore.rollStartTime != itemObjects["rollStartTime"]) {
            delete itemObjects["rollStartTime"];
        }
        if (myRyCore.rpcType != itemObjects["rpcType"]) {
            delete itemObjects["rpcType"];
        }
        if (myRyCore.dataProperties != itemObjects["dataProperties"]) {
            delete itemObjects["dataProperties"];
        }
        if (myRyCore.eventListeners != itemObjects["eventListeners"]) {
            delete itemObjects["eventListeners"];
        }
        if (myRyCore.eventHandlers != itemObjects["eventHandlers"]) {
            delete itemObjects["eventHandlers"];
        }
        if (myRyCore.preEventHandlers != itemObjects["preEventHandlers"]) {
            delete itemObjects["preEventHandlers"];
        }

        if (myRyCore.postEventHandlers != itemObjects["postEventHandlers"]) {
            delete itemObjects["postEventHandlers"];
        }
        if (myRyCore.adServerDomain != itemObjects["adServerDomain"]) {
            delete itemObjects["adServerDomain"];
        }
        if (myRyCore.transportSocket != itemObjects["transportSocket"]) {
            delete itemObjects["transportSocket"];
        }
        if (myRyCore.easyXDM != itemObjects["easyXDM"]) {
            delete itemObjects["easyXDM"];
        }
        if (myRyCore.additionalPublisherDataProperties != itemObjects["additionalPublisherDataProperties"]) {
            delete itemObjects["additionalPublisherDataProperties"];
        }
    }

    function completeTest(event){
        myRyCore.closeAd(); // this seems to be deleting the object??
        if (jQuery.isEmptyObject(itemObjects)) {
            _testState.createReport(true, "");
        } else {
            var remainingItems = ""
            for (var key in itemObjects){
                remainingItems += key + "<br>"
            }
            _testState.createReport(false, "", remainingItems);
        }
    }    
})();
