var functions = {};

self.addEventListener("message", function(e) {
	if (e.data.type == "code") {
		try {
			functions = eval("(" + e.data.code + ");");
		}
		catch (err) {
			console.log(err.message);
			console.log("Line #:" + err.lineNumber);
		}
	}
	else if (e.data.type == "func") {
		if (typeof functions[e.data.func] === "undefined") {
			self.postMessage({
				type:"error",
				message:"Function '" + e.dat + "' doesn't exist!"
			});
		}
		else {
			console.log("callig func " + e.data.func);
			self.postMessage({
				type:"retVal",
				val:functions[e.data.func]()
			});
		}
	}
});