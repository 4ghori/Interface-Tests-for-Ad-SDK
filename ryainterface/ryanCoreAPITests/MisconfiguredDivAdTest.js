(function() {
	function loadAd(lib) {
		try {
			lib.loadAd();
		} catch(e) {

			if( e == 'Div (AdDivDisplayNone): display style cannot not be set to "none"!!! Use visibility:hidden instead!') {
				_testState.createReport(true,"");
				return;
			}
		}
		_testState.createReport(false,"","AdDivDisplayNone expected exception but none thrown");
	}
	var _testState = undefined;
	setValues({ "initializeCallback": function(testState) {
					_testState=testState;
				},
				"testName":"Misconfigured Ad Div",
				"AdObject":{
					"placeguid":"FA81C58619",
					"nameSpace":'ryCore', 
					"containerId":'AdDivDisplayNone', 
					"adServerDomain": _getRemoteDomain(),
					"autoHide":true
				},
				"runNumOfTimes":1, 
				"customLoad":loadAd,
				"maxRuntime":45000
				}
			);
	
})();