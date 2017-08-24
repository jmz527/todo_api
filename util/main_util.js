

// Generates a universally unique ID
function genUUID() {
	return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == `x` ? r : (r&0x3|0x8);
		return v.toString(16);
	});
};




// https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
function _escapeString(val) {
	val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
		switch (s) {
			case "\0":
				return "\\0";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\b":
				return "\\b";
			case "\t":
				return "\\t";
			case "\x1a":
				return "\\Z";
			case "'":
				return "''";
			case '"':
				return '""';
			default:
				return "\\" + s;
		}
	});

	return val;
}





// This is used to wrap native DOM events without writing over them
function addEvent(object, type, callback) {
	if (object == null || typeof(object) == `undefined`) return;
	if (object.addEventListener) {
		object.addEventListener(type, callback, false);
	} else if (object.attachEvent) {
		object.attachEvent(`on${type}`, callback);
	} else {
		object[`on${type}`] = callback;
	}
};


// Unflatten JSON
function unflattenJSON(data) {
		`use strict`;
		if (Object(data) !== data || Array.isArray(data))
				return data;
		var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
				resultholder = {};
		for (var p in data) {
				var cur = resultholder,
						prop = ``,
						m;
				while (m = regex.exec(p)) {
						cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
						prop = m[2] || m[1];
				}
				cur[prop] = data[p];
		}
		return resultholder[``] || resultholder;
};


// Flatten JSON
function flattenJSON(data) {
		var result = {};
		function recurse (cur, prop) {
				if (Object(cur) !== cur) {
						result[prop] = cur;
				} else if (Array.isArray(cur)) {
						 for(var i=0, l=cur.length; i<l; i++)
								 recurse(cur[i], `${prop}[${i}]`);
						if (l == 0)
								result[prop] = [];
				} else {
						var isEmpty = true;
						for (var p in cur) {
								isEmpty = false;
								recurse(cur[p], prop ? `${prop}.${p}` : p);
						}
						if (isEmpty && prop)
								result[prop] = {};
				}
		}
		recurse(data, ``);
		return result;
};



exports.genUUID = genUUID;
exports._escapeString = _escapeString;
exports.addEvent = addEvent;
exports.unflattenJSON = unflattenJSON;
exports.flattenJSON = flattenJSON;