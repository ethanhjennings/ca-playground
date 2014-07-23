self.addEventListener("message", function(e) {
	if (e.data.type == "addFunc") {
		eval(e.data.code);
	}
	else if (e.data.type == "runFunc") {
		self[e.data.name]();
	}
});