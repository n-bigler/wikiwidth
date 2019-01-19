/**
 * Listen for changes in the parameters, and ask the content
 * scripts to update.
 */
function listenForChanges() {
	var urlPattern = "*://*.wikipedia.org/wiki/*";
	console.log("in listenForChangesFunction");
	var onOffCB = document.querySelector("input[name=status]");
	onOffCB.addEventListener("change", (e) => {
		if(onOffCB.checked){
			browser.tabs.query({url: urlPattern}).then(turnOn);	
		}else{
			browser.tabs.query({url: urlPattern}).then(turnOff);	
		}
	});

	/**
	 * Store the new status and send the message to
	 * the content scripts to update.
	 */
	function turnOn(tabs) {
		browser.storage.local.set({
			"status": true 
		});
		for (let tab of tabs) {
			browser.tabs.sendMessage(tab.id, {
				command: "update" 
			});
		}
	}

	/**
	 * Store the new status and send the message to
	 * the content scripts to update.
	 */
	function turnOff(tabs) {
		browser.storage.local.set({
			"status":	false 
		});

		for (let tab of tabs) {
			browser.tabs.sendMessage(tab.id, {
				command: "update" 
			});
		}
	}

	/**
	 * Store the new size and send message to the content scripts
	 * to update.
	 */
	function resize(param){
		var tabs = param[0];
		var size = param[1];
		browser.storage.local.set({
			"width": size
		});
		for (let tab of tabs) {
			browser.tabs.sendMessage(tab.id, {
				command: "resize",
				value: size
			});
		}
	}
	
	var sizeSlider = document.querySelector("input[name=sizeSlider]");
	sizeSlider.addEventListener("input", (e) => {
		browser.tabs.query({url: urlPattern}).then(
			(tabs) => {return [tabs, e.target.value]}).then(resize);
	});
}

function setWidth(result){
	var width = 1000;
	if(result.width){
		width = result.width;
	}
	var sizeSlider = document.querySelector("input[name=sizeSlider]");
	sizeSlider.value = width;
}
function setStatus(result){
	var statusCB = document.querySelector("input[name=status]");
	if(result.status){//could be undefined
		statusCB.checked = true;	
	}else {
		statusCB.checked = false;	
	}
}
function onError(error){
	console.log("Error: ${error}");
}
/**
 * Retrieves the parameters to set up the popup
 */
function updatePopup(){
	var gettingStatus = browser.storage.local.get("status");
	gettingStatus.then(setStatus, onError);
	var gettingWidth = browser.storage.local.get("width");
	gettingWidth.then(setWidth, onError);
}

updatePopup();
listenForChanges();
