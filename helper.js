function create2DArray(width,height,initFunc) {
	var array = [];
	for (var y; y < height; y++) {
		array.push([]);
		for (var x; x < width; x++) {
			if (typeof initFunc != "undefined")
				array.push(initFunc(x,y));
			else
				array.push(0);
		}
	}
}