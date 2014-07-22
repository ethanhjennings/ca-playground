function CodeRunner() {
	this.worker = new Worker("coderunner-worker.js");
}

CodeRunner.prototype.setCode = function(code) {
	this.worker.postMessage({type:'code',code:code});
}

CodeRunner.prototype.runFunc = function(funcName,callback) {
	this.worker.addEventListener('message',function (e) {
		if (e.data.type == "error") {
			alert(e.data.message);
		}
		else if (e.data.type == "retVal") {
			callback(e.data.val);
		}
	});
	this.worker.postMessage({type:'func',func:funcName});
}