// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.message) {
			case 'getUrl':
					chrome.runtime.sendMessage({"message": "pageUrl", "url": window.location.href}); break;
		}
	}
);