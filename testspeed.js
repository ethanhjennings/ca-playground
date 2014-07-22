self.addEventListener("message", function(e) {
	for (var i = 0; i <1000; i++) {
		var x = Math.random();
		x = Math.sin(50);
	}
	self.postMessage("test");
});