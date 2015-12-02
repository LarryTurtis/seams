var max = 0;

exports.setMax = function(newMax) {
	max = newMax;
	return max;
}

exports.getMax = function() {
	return max;
}