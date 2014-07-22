self.addEventListener("test", function(e) {
	for (var i = 0; i <10000; i++) {
		var x = Math.random();
	}
	self.postMessage("test");
}