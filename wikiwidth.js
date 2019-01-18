(function() {
	function updateSettings(){
		console.log("updating");
		
		/**
		 * Update the page depending on the status.
		 * Retrieves the width if the status is true (on),
		 * otherwise, calls clearStyle().
		 */ 
		function setCurrentStatus(result) {
			console.log("status retrieved");
			console.log(result.status);
			if (result.status){//true and defined
				var getWidth = browser.storage.local.get("width");
				getWidth.then(resize, onError);
			}else {
				clearStyle();
			}
		}
		
		/**
		 * Adds width attribute to the div "content" to
		 * resize the page.
		 */
		function resize(result){
			console.log("resizing");
			var width = 1000;
			if(result.width){//could also be undefined
				width = result.width;
			}
			const contentEl = document.getElementById('content');
			contentEl.style.width = width+'px';
		}

		function onError(error) {
			console.log('Error: ${error}');
		}
		console.log("retrieving status");
		var gettingStatus = browser.storage.local.get("status");
		gettingStatus.then(setCurrentStatus, onError);
	}

	/**
	 * Removes all attributes to the div "content" to remove
	 * any page resizing
	 */
	function clearStyle(){
		const contentEl = document.getElementById('content');
		contentEl.removeAttribute("style");
	}
	
  /**
   * Listen for messages from the background script.
   * Calls updateSettings() when something is received.  
	 */  
  browser.runtime.onMessage.addListener((message) => {
		updateSettings();
  });

	updateSettings();	

})();

