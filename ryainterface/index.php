<?php
    require_once("rya/config/IncludePath.php");
    require_once("adserver/AdServerDealInterface.php");


    // Ops need to fix the alternate domain before this can be
    $domainLookup = array(
            'rya.rockyou.com' => 'rya.rockyou.com',/*'rya.rockpets.com',*/
            'rockyou.com' => 'rockyou.com',/*'rockpets.com',*/
        );

    $curDomain = $_SERVER['HTTP_HOST'];
    list( $subDomain, $baseDomain ) = explode(".", $curDomain, 2);

    if( array_key_exists( $curDomain, $domainLookup ) == true ) {
        // rya is public/frontend so we have to do something special
        $remoteDomain = $domainLookup[$curDomain];
    } else if ( array_key_exists( $baseDomain, $domainLookup ) == true ) {
        $remoteDomain = "{$subDomain}.{$domainLookup[$baseDomain]}";
    } else {
        $remoteDomain = $curDomain;
    }

    $filelist = array();
    foreach( glob("ryanCoreAPITests/*.js") as $filename ) {
        if ( $filename == "ryanCoreAPITests/FileSaver.js") { continue; }
        $filelist[] = $filename;
    }

    // need to create values for deal tests
    function generateDealValues($userId,$placeguid) {
        $rewardUrl = "http://{$serverdomain}/ams/dotd/test/reward.php";
        $timeStamp = time();
        $dealInterface = new AdServerDealInterface();
        $secretKey = $dealInterface->getPublisherKey($placeguid);
        $signature = md5($userId . $placeguid . $timeStamp . $secretKey); //order of fields is important here.
        return array( 'userId' => $userId,
                      'initTimeStamp' => $timeStamp,
                      'signature' => $signature,
                      'rewardUrl' => $rewardUrl,
                      'preRewardMsg' => 'Earn 50 juice!'
                );
    }

    $dealTestValues = array();
    $configs = array(  'validDeal' => array('44E2758743','21C5A58784'),
                       'invalidDealPlaceguid' => array('X44E2758743'),
                       'invalidDealSignature' => array('44E2758743') 
                    );

    foreach( $configs as $key => $placeguids ) {
        if( ! array_key_exists($key, $dealTestValues) ) {
            $dealTestValues[$key] = array();
        }

        $count = 0;
        foreach( $placeguids as $placeguid ) {
            $data = undef;
            switch( $key ) {
                case 'validDeal': case 'invalidDealPlaceguid':
                    $data = array ( 
                            'deal' => generateDealValues( '100000906162306', $placeguid ),
                            'placeguid' => $placeguid 
                        );
                    break;
                case 'invalidDealSignature':
                    $data = array ( 
                            'deal' => generateDealValues( '100000906162306', 'X44E2758743' ),
                            'placeguid' => $placeguid
                        );
                    break;
            }
            $dealTestValues[$key][$count] = $data;
            $count++;
        }
    }

    $jsonDealData = json_encode($dealTestValues);

?>
<html>
    <head>
        <script>
            function _getRemoteDomain() {
                return "<?php echo $remoteDomain;?>";
            }

            function _getDomain() {
                return "<?php echo $curDomain;?>";
            }
        </script>
    </head>
    <body>
            <a download="results.txt" href="" id="link"></a>
            <div id="Header" style="display:block;position:absoulute;width:48%;height:60px;left:0px;top:0px;">

                <div id="Header" style="display:block;position:relative;left:0px;top:0px;font-size:20px">
                    RYANCore API Automated Testing
                </div>
                <div id="rycoreVersion" style="display:inline;position:relative;left:0px;">
                    RYANCore: v
                </div>
                <div id="numTests" style="display:inline;position:relative;left:0px;background-color:yellow;padding:1px">
                    Number of Tests: 0
                </div>
                <div id="numPassed" style="display:inline;position:relative;background-color:green;color:white;padding:1px">Passed: 0</div>
                <div id="numFailed" style="display:inline;position:relative;background-color:red;color:white;padding:1px">Failed: 0</div>
                <label for="globalRepeat">Repeat: </label>
                <input type="text" id="globalRepeat" value="0" style="width:30px;" maxlength="3" readonly="true"></input>
                <button onclick='downloadResults();' disabled="true" style="display:inline-block;" id="download">Download Results</button>
            </div>

            <div id="AdDivDisplayNone" style="display:none;position:absolute;width:48%;height:390px;left:0px;top:50px;margin:10px;"></div>
            <div id="AdDiv" style="visibility:hidden;position:absolute;width:48%;height:390px;left:0px;top:50px;margin:10px;"></div>

            <div id="OutputDiv" style="display:block;position:absolute;width:48%;height:580px;left:0px;top:450px;margin:10px;overflow:auto;border: 2px solid;border-radius: 15px;border-color:black;z-index:100;">
            </div>

            <div id="InfoDiv" style="display:block;position:absolute;width:50%;min-height:1035px;max-height:95%;left:49%;top:0;margin:5px;overflow:auto;border: 2px solid;border-radius: 15px;border-color:black;z-index:100;">
            </div>

        <script type="text/javascript" src="ryanCoreAPITests/FileSaver.js"></script>
        <script type="text/javascript" src="//<?php echo $remoteDomain;?>/rya/js/RYANCoreUtils.js"></script>
        <script type="text/javascript" src="//<?php echo $remoteDomain;?>/rya/js/RYANCore.cb.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript">

            var dealTestData = <?php echo $jsonDealData; ?>;

            var EventsAndHandlersManager = new (function() {
                var self = this;
                this.eventArray = [ ];
                this.handlerArray = [ ];

                this.addEventLists = function( ) {
                    for( var i in arguments ) {
                        var enumList = arguments[i];
                        for( var j in enumList) {
                            var eenum = enumList[ j ]; // need the name here
                            self.eventArray.push( eenum );
                        }
                    }
                }
                this.getEventLists = function() {
                    return self.eventArray;
                }
                this.addHandlerLists = function( ) {
                    for( var i in arguments ) {
                        var enumList = arguments[i];
                        for( var j in enumList) {
                            var eenum = enumList[ j ]; // need the name here
                            self.handlerArray.push( eenum );
                        }
                    }
                }
                this.getHandlerLists = function() {
                    return self.handlerArray;
                }
                this.resetEventLists = function() {
                    self.eventArray = [];
                    self.addEventLists( RYANCore.publicEvents );
                }
                this.resetHandlerLists = function() {
                    self.handlerArray = [];
                    self.addHandlerLists( RYANCore.publicHandlers );
                }
                this.reset = function() {
                    self.resetEventLists();
                    self.resetHandlerLists();
                }
                this.reset();
            })();

            var globalRepeat = 0;
            var index = 0;
            var testObjects = [];
            var firstLaunch = true;
            var shouldEmail = false;
            var ryCore = {}
            var isDestroyed = false;
            var overridePlaceguid = "";
            var numberOfRepeats = 1;

            var _currentTestName = '';
            var _currentTestRepeat = 0;

            function initialSetup() {
                var repeatGET = "<?php echo $_GET['repeats'];?>";
                var email = "<?php echo $_GET['email'];?>";
                var placeguid = "<?php echo $_GET['placeguid'];?>"
                if (repeatGET != "") {
                    numberOfRepeats = 
                        globalRepeat = parseInt("<?php echo $_GET['repeats'];?>");
                    document.getElementById("globalRepeat").value = "<?php echo $_GET['repeats'];?>";
                } else {
                    globalRepeat = 1;
                    document.getElementById("globalRepeat").value = "0";
                }
                if (email == "false") {
                    shouldEmail = false;
                }
                if (placeguid != "") {
                    overridePlaceguid = placeguid;
                }
            }

            function setValues(testObject) {
                if (firstLaunch) {
                    initialSetup();
                }
                for (var x = 0; x < testObject["runNumOfTimes"]; x++) {
                    testObjects.push(testObject);
                    setupHeader(testObjects.length * numberOfRepeats);
                }
                if (firstLaunch) {
                    firstLaunch = false
                    setupAd();
                }
            }

            function setupHeader(value) {
                document.getElementById("numTests").innerHTML = "Number of Tests: " + value;
            }

            function setupAd() {

                var registerListenerGroup = function(handler,time,ryCore) {
                    ryCore.registerPreEventHandler (handler, outputHandler(handler,"PreEventHandler", time, "padding: 0px 0px 0px 20px;background-color:lightblue;"), ryCore);
                    ryCore.registerEventHandler    (handler, outputHandler(handler,"EventHandler",    time, "padding: 0px 0px 0px 20px;background-color:turquoise;"), ryCore);
                    ryCore.registerPostEventHandler(handler, outputHandler(handler,"PostEventHandler",time, "padding: 0px 0px 0px 20px;background-color:aquamarine;"), ryCore);
                }

                function initializationHandler(testObjectData){

                    testObjectData.state.time = (new Date()).getTime();

                    testObjectData.state.createReport = function(pass, extraMessageData, extraData) {
                        try{ clearTimeout(testObjectData.state.timer); } catch (e){}
                        _createReport(pass, extraMessageData, extraData, testObjectData.state);
                    };

                    var time = testObjectData.state.time;

                    createMessage("", "", "OutputDiv", time);
                    createMessage(("Test " + (index+1) + ": " + testObjectData.state.testName), "background-color:yellow;font-size:20px;padding: 0px 0px 0px 10px;", time);

                    try {
                        testObjectData.initializeCallback(testObjectData.state);
                    }
                    catch(e) { 
                        alert( "Error: Unable to finish setting up test ("+testObjectData.state.testName+") parameter 'initializeCallback' " + e ); 
                        throw e; 
                    }

                    // events registered here will miss the init handler, however it is called
                    // to launch this function
                    var events = EventsAndHandlersManager.getEventLists();
                    for( var eventsIndex in events ) {
                        var event = events[eventsIndex];
                        this.registerEventListener(event, outputHandler(event,"EventListener",time,"padding: 0px 0px 0px 20px;background-color:cornflowerblue;"), this);
                    }
                    
                    var handlers = EventsAndHandlersManager.getHandlerLists();
                    for(var handlersIndex in handlers) {
                        registerListenerGroup(handlers[handlersIndex],time,this);
                    }
                    // events registered here will miss the init handler, however it is called
                    // to launch this function

                    if( ! testObjectData.maxRuntime ) {
                        testObjectData.maxRuntime = 60000;
                    }

                    testObjectData.state.timer = setTimeout(
                        function() {
                            testObjectData.state.createReport(false,"","Test failed due to timer expiration!");
                        },
                        testObjectData.maxRuntime
                    );

                    if( ! testObjectData.hasOwnProperty("customLoad") && 
                        typeof testObjectData.customLoad !== 'function' ) {
                        ryCore.loadAd();
                    } else {
                        testObjectData.customLoad(ryCore);
                    }
                }

                var testObjectData = testObjects[index];
                var curTestName = testObjectData.testName;

                // getting curTestName for determing count, need to refactor later
                if( curTestName == _currentTestName ) {
                    _currentTestRepeat++;
                } else {
                    _currentTestName = curTestName;
                    _currentTestRepeat = 1;
                }

                isDestroyed = false;

                if( typeof testObjectData.preInitializationCallback == 'function') {
                    testObjectData.preInitializationCallback(_currentTestRepeat);
                }

                if (overridePlaceguid != "") {
                    testObjectData.AdObject["placeguid"] = overridePlaceguid;
                }

                var config = testObjectData.AdObject;
                if( !('adServerDomain' in config) ) {
                    config.adServerDomain = document.domain;
                }

                EventsAndHandlersManager.reset();

                ryCore = new RYANCore(config);
                ryCore.setAdServerDomain(document.domain);
                ryCore.setAdSize("100%", "100%");

                testObjectData.state = {
                    testName : testObjectData.testName + " ("+config.placeguid+")",
                    count : _currentTestRepeat,
                    time : undefined,
                    lib : ryCore
                };

                document.getElementById("rycoreVersion").innerHTML = "RYANCore: v" + ryCore.version;
                
                // interface change due to post loading of libraries and utils.
                ryCore.registerEventHandler(RYANCore.HINITIALIZED, function() { initializationHandler.call(ryCore,testObjectData); }, ryCore);
                ryCore.registerPreEventHandler(RYANCore.HDESTROY, setAsClosed, ryCore);
            }

            function setAsClosed() {
                isDestroyed = true;
            }

            function outputHandler(handler,functionType,oldTimeStamp,divStyle) {
                var handlerName = handler;
                var callbackType = functionType; 
                var ts = oldTimeStamp;
                
                if(!divStyle) {divStyle = "padding: 0px 0px 0px 20px;";}
                
                return function (event) {
                    if (!event.hasOwnProperty("placeguid") || event.placeguid === ryCore.placeguid) {
                        try {
                            if( typeof event.event == "string" ) {
                                createMessage( functionType+": " + event.event, divStyle, ts);
                            } else {
                                // this is an error, how to I increment the error count??
                                createMessage( functionType+":" + handlerName.event + " Event name was not a string", "background-color:red;padding: 0px 0px 0px 20px;", ts);
                            }                            
                        } catch(e) {
                            createMessage( functionType+":" + handlerName.event + " Event was not passed in!", "background-color:red;padding: 0px 0px 0px 20px;", ts);
                        }
                    }
                };
            }

            function createMessage(theMessage, divStyle, parentDiv, divID) {
                var element = document.createElement("div");
                element.style.cssText = divStyle;
                element.innerHTML = theMessage;
                if (divID != undefined) {
                    element.id = divID;
                }
                if (parentDiv != undefined) {
                    document.getElementById(parentDiv).appendChild(element);
                } else {
                    document.getElementById("OutputDiv").appendChild(element); 
                }
            }

            function _createReport(pass, extraMessageData, extraData, testState) {
                var testObjectData = testObjects[index];

                var color;
                var endTime = (new Date()).getTime();
                endTime -= testState.time;
                endTime /= 1000;
                if (pass) {
                    createMessage((testObjectData.state.testName + ": Passed in " + endTime + " seconds ") + extraMessageData, "background-color:green;font-size:20px;padding: 5px 0px 0px 10px;", "InfoDiv", index + "" + globalRepeat);
                    if (extraData != undefined) {
                        createMessage(extraData, "font-size:20px;background-color:orange;padding: 0px 0px 0px 20px;border-radius: 10px 0px 0px 10px;", index + "" + globalRepeat);
                    }
                    count(true);
                } else {
                    createMessage((testObjectData.state.testName + ": Failed after " + endTime + " seconds ") + extraMessageData, "background-color:red;font-size:20px;padding: 5px 0px 0px 10px;", "InfoDiv", index + "" + globalRepeat);
                    if (extraData != undefined) {
                        createMessage(extraData, "font-size:15px;background-color:orange;padding: 0px 0px 0px 20px;border-radius: 10px 0px 0px 10px;", index + "" + globalRepeat);
                    }
                    count(false);
                }
                
                if (!isDestroyed) {
                    ryCore._Destroy();
                }
                index++;
                if (index >= testObjects.length) {
                    finished();
                } else {
                    setupAd();
                }
            }

            function verifyEventObjects(testParams) {
                if( ! (this instanceof RYANCore) ){
                    throw "this not typeof RYANCore, please bind to instance under test";
                }
                var results = [];
                for (key in testParams) {
                    var evt = testParams[key];
                    if (evt.ignore) { continue; }
                    switch( evt.expected ) {
                        case "any":
                            // just needs to be bigger than 0
                            if (evt.called <= 0 ) {
                                results.push( createOutputMessageObject(key, evt.called, 'greater than 0') );
                            }
                            break;
                        case "lib":
                            // just needs to be equal to the number of modules
                            var libcnt = Object.keys(this.config.lib).length;
                            if (evt.called != libcnt ) {
                                results.push( createOutputMessageObject(key, evt.called, libcnt) );
                            }
                            break;
                        default:
                            if (evt.called != evt.expected) {
                                results.push( createOutputMessageObject(key, evt.called, evt.expected) );
                            }
                            break;
                    }
                    
                }
                return results;
            }

            function createOutputMessageObject(event, called, expected) {
                if (called < 1) {
                    var term = " times";
                    if (expected == 1) { term = " time"; }
                    return event + " (Not called but expected " + expected + term + ")";
                }
                else if (expected < 1) {
                    var term = " times ";
                    if (called == 1) { term = " time "; }
                    return event + " (Called " + called + term + "but not expected)";
                }
                else {
                    var cTerm = " times ";
                    if (called == 1) { cTerm = " time "; }
                    var eTerm = " times ";
                    if (expected == 1) { eTerm = " time "; }
                    return event + " (Called " + called + cTerm + "but expected " + expected + eTerm + ")";
                }
            }

            function count(passFail) {
                var theDiv
                var theHTML
                if (passFail) {
                    var theDiv = document.getElementById("numPassed")
                    var theHTML = document.getElementById("numPassed").innerHTML
                } else {
                    var theDiv = document.getElementById("numFailed")
                    var theHTML = document.getElementById("numFailed").innerHTML
                }
                var getNum = theHTML.split(":");
                var currentCount = parseInt(getNum[1]);
                theDiv.innerHTML = getNum[0] + ": " + String(++currentCount);
            }

            function finished() {
                globalRepeat--;
                document.getElementById("globalRepeat").value = globalRepeat;
                if (globalRepeat > 0) {
                    createMessage("Finished Repeat. " + globalRepeat + " remaining.", "background-color:orange;font-size:20px;");
                    index = 0;
                    // resetting counts
                    _currentTestName = '';
                    _currentTestRepeat = 0;
                    setupAd();
                } else {
                    createMessage(passFailInfo(), "background-color:blue;font-size:20px;padding: 5px 0px 0px 10px;color:white;", "InfoDiv", "Final")
                    document.getElementById("download").disabled=false;
                    if (shouldEmail) {
                        createEmail();
                    }
                }
            }

            function createEmail() {
                var addresses = "adseng@rockyou.com,adsqa@rockyou.com"
                var from = "adsend@rockyou.com"
                var subject = "RYANCore Test Results"
                var body = gatherResults();

                $.post("ryanCoreAPITests/sendEmail.php",
                    { emailTo: addresses, emailFrom: from, subject: subject, message: body },
                        function(data){});
            }

            function downloadResults() {
                link = gatherResults();
                var blob = new Blob([decodeURI(link)], {type: "text/plain;charset=utf-8"})
                saveAs(blob, "Results.txt")
            }

            function gatherResults() {
                var link = ""
                link += passFailInfo() + "%0D%0A %0D%0A";
                var descendents = $('#InfoDiv').children();
                for (var x = 0; x < descendents.length; x++) {
                    var element = descendents[x];
                    link += $(element).clone().children().remove().end().text() + "%0D%0A";
                    
                    var div = element.getElementsByTagName("div")
                    if (div[0] != undefined) {
                        var tempLink = div[0].innerHTML;
                        tempLink = tempLink.split("<br>");
                        for (var y = 0; y < tempLink.length; y++) {
                            link += "%09" + tempLink[y] + "%0D%0A";
                        }
                    }

                }
                return link
            }

            function passFailInfo() {
                var text = ""
                text += document.getElementById("numTests").innerHTML + " ";
                text += document.getElementById("numPassed").innerHTML + " ";
                text += document.getElementById("numFailed").innerHTML + " ";

                return text;
            }

        </script>

        <?php
            if ($_GET['test'] != null) {
                $tests = explode(',',$_GET['test']);
                foreach ($tests as $test) {
                    echo '<script type="text/javascript" src="ryanCoreAPITests/',str_replace(' ', '',$test),'.js"></script>', PHP_EOL;
                }
                
            } else {
                foreach($filelist as $filename) {
                    echo '<script type="text/javascript" src="',$filename,'"></script>', PHP_EOL;
                }
            }
        ?>

    </body>
</html>