function CodeRunner() {
	this.worker = new Worker("coderunner-worker.js");
	this.functions = {};
}

CodeRunner.prototype.addFunction = function(name,func) {
	this.functions[name] = func;
	this.worker.postMessage({type:'addFunc',code:func.toString()});
};

CodeRunner.prototype.hasFunction = function(name) {
	return typeof this.functions[name] != "undefined";
}

CodeRunner.prototype.lazyAddFunction = function(name,func) {
	if (!this.hasFunction.call(this,name))
		this.addFunction.call(this,name,func)
};

CodeRunner.prototype.runFunc = function(name,callback) {
	this.worker.addEventListener('message',function (e) {
		if (e.data.type == "error") {
			alert(e.data.message);
		}
		else if (e.data.type == "retVal") {
			callback(e.data.val);
		}
	});
	this.worker.postMessage({type:'runFunc',name:funcName});
};