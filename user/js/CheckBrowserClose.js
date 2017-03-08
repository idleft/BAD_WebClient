/**
 * This javascript file checks for the brower/browser tab action.
 * It is based on the file menstioned by Daniel Melo.
 * Reference: http://stackoverflow.com/questions/1921941/close-kill-the-session-when-the-browser-or-tab-is-closed
 */
var validNavigation = false;

function wireUpEvents() {
    /**
     * For a list of events that triggers onbeforeunload on IE
     * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
     *
     * onbeforeunload for IE and chrome
     * check http://stackoverflow.com/questions/1802930/setting-onbeforeunload-on-body-element-in-chrome-and-ie-using-jquery
     */
    var dont_confirm_leave = 0; //set dont_confirm_leave to 1 when you want the user to be able to leave without confirmation
    var leave_message = 'You sure you want to leave?'
	
	function logout(){
		console.log("1deamaxwu ---> browser close TEST");
        var url = 'http://' + window.sessionStorage.getItem('brokerUrl') + '/logout';
        var method = "POST";
        var postData = {
            'dataverseName': "channels",
            'userId': window.sessionStorage.getItem('pubuserId'),
            'accessToken': window.sessionStorage.getItem('pubaccessToken')
        };
        // You REALLY want async = true.
        // Otherwise, it'll block ALL execution waiting for server response.
        var async = true;

        var request = new XMLHttpRequest();

        // Before we send anything, we first have to say what we will do when the
        // server responds. This seems backwards (say how we'll respond before we send
        // the request? huh?), but that's how Javascript works.
        // This function attached to the XMLHttpRequest "onload" property specifies how
        // the HTTP response will be handled. 
        request.onload = function() {

            // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
            // object declared above is available in this function even though this function
            // executes long after the request is sent and long after this function is
            // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
            // applications.

            // You can get all kinds of information about the HTTP response.
            var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
            var data = request.responseText; // Returned data, e.g., an HTML document.
        }

        request.open(method, url, async);

        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        // Or... whatever

        // Actually sends the request to the server.
        request.send(JSON.stringify(postData));

	}
    function goodbye(e) {
        
        if (!validNavigation) {
            if (dont_confirm_leave !== 1) {
                if (!e) e = window.event;
                //e.cancelBubble is supported by IE - this will kill the bubbling process.
                e.cancelBubble = true;
                e.returnValue = leave_message;
                //e.stopPropagation works in Firefox.
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
				logout();
                //return works for Chrome and Safari
                return leave_message;
            }
        }
    }
    window.onbeforeunload = goodbye;

    // Attach the event keypress to exclude the F5 refresh
    $(document).bind('keypress', function(e) {
        leave_message = e.keyCode;
        if (e.keyCode == 116) {
            validNavigation = true;
        }
    });

    // Attach the event click for all links in the page
    $("a").bind("click", function() {
        validNavigation = true;
    });

    // Attach the event submit for all forms in the page
    $("form").bind("submit", function() {
        validNavigation = true;
    });

    // Attach the event click for all inputs in the page
    $("input[type=submit]").bind("click", function() {
        validNavigation = true;
    });

}
// Wire up the events as soon as the DOM tree is ready
$(document).ready(function() {
    wireUpEvents();
});
