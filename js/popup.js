document.addEventListener("DOMContentLoaded", function() {
    
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "getUrl"});
    });

    var btns = document.querySelectorAll('#copy_url, #copy_id');

    btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            copyTargetString(this);
        });
    });
    
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if (request.message === "pageUrl") {

            document.querySelector('input').value = decodeURIComponent(request.url);
            openDevConsole(request.url);
		}
	}
);

function openDevConsole(url) {

    var devConsoleUrl = url.substring(0, url.indexOf('force.com') + 9) + '/_ui/common/apex/debug/ApexCSIPage';

    document.querySelector('#openDev').addEventListener('click', function() {
        
        chrome.tabs.create({url: devConsoleUrl});
        console.log('click ' + devConsoleUrl);
    });
}

function copyTargetString(btn) {

    var elemId = btn.getAttribute('id');
    var url = document.querySelector('input').value;

    switch (elemId) {
        case "copy_url":
                copyString(url, btn); break;
        case "copy_id":
                getId(url, btn); break;
    }
}

function getId(url, btn) {
    var idStart = url.substring(url.indexOf('/0') + 1);

    var idEndIndex = idStart.indexOf('/');
    
    idEndIndex = idEndIndex == -1 ? idStart.indexOf('?') : idEndIndex;
    idEndIndex = idEndIndex == -1 ? idStart.indexOf('&') : idEndIndex;
    idEndIndex = idEndIndex == -1 ? idStart.length : idEndIndex;

    var id = idStart.substring(0, idEndIndex);
    copyString(id, btn);
}

function copyString(str, btn) {

    var elem = document.createElement('textarea');
    elem.value = str;

    document.body.appendChild(elem);
    elem.select();

    try {
        document.execCommand('copy');
        document.body.removeChild(elem);

        setTooltipMessage(btn, 'copied!');
    } catch (e) {
        setTooltipMessage(btn, '#Error!');
    }   
}

function setTooltipMessage(btn, message) {
    var tooltip = btn.querySelector('.tooltip');
    tooltip.innerHTML = message;
    tooltip.style.display = 'block';

    setTimeout(function() {
        tooltip.innerHTML = '';
        tooltip.style.display = 'none';
    }, 1000);
}