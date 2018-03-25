// GNU gettext PO to webL10n JavaScript ini file converter

// Require
var	fs = require('fs'),
	readline = require('line-reader'),
	path = require('path'),
	minimist = require('minimist');

// constant
var defaultOutputfile = "locale.ini";
var defaultTemplateFile = "template.pot";

// Get arguments
var argv = minimist(process.argv.slice(2), {string: 'o'});
if (argv._.length == 0) {
	console.log("Usage: "+process.argv[0]+" po2ini.js [-o <outputfile>] <pofile1> [<pofile2> ...]");
	return;
}
var outputFile = defaultOutputfile;
if (argv.o) {
	outputFile = argv.o;
}

// Processing function
function processFiles(fd, filenames, index) {
	var basename = path.basename(filenames[index]);
	var sectioname = (basename == defaultTemplateFile ? "*" : basename.substr(0,basename.indexOf(".")));

	// Load all lines
	var state = -1;
	var msgctxt = "";
	var msgid = "";
	var msgstr = "";

	readline.eachLine(fs.createReadStream(filenames[index], {options: 'utf-8'}), function(line, last) {
		// Write setHeader
		if (state == -1) {
			console.log("Process "+filenames[index]+"...")
			fs.write(fd, crlf+"["+sectioname+"]"+crlf);
			state = 0;
		}

		// Get line type
		var isMsgctxt = line.match(/msgctxt\s*"([^"]*)"/);
		var isMsgid = line.match(/msgid\s*"([^"]*)"/);
		var isMsgstr = line.match(/msgstr\s*"([^"]*)"/);
		var isString = line.match(/^"([^"]*)"/);
		var isOther = (!isMsgctxt && !isMsgid && !isMsgstr && !isString);

		// Look for msgctxt and strings
		if (state == 0) {
			if (isMsgctxt) {
				msgctxt = (isMsgctxt.length > 1) ? isMsgctxt[1] : "";
				state = 1;
			}
		} else if (state == 1) {
			if (isString) {
				msgctxt += (isString.length > 1) ? isString[1] : "";
			} else {
				state = 2;
			}
		}

		// Look for msgid and strings
		if (state == 2) {
			if (isMsgid) {
				msgid = (isMsgid.length > 1) ? isMsgid[1] : "";
				state = 3;
			}
		} else if (state == 3) {
			if (isString) {
				msgid += (isString.length > 1) ? isString[1] : "";
			} else {
				state = 4;
			}
		}

		// Look for msgstr and stings
		if (state == 4) {
			if (isMsgstr) {
				msgstr = (isMsgstr.length > 1) ? isMsgstr[1] : "";
				if (last) {
					fs.write(fd, msgctxt + "=" + msgstr + crlf);
				}
				state = 5;
			}
		} else if (state == 5) {
			if (isString) {
				msgstr += (isString.length > 1) ? isString[1] : "";
				if (last) {
					fs.write(fd, msgctxt + "=" + msgstr + crlf);
				}
			} else {
				fs.write(fd, msgctxt + "=" + msgstr + crlf);
				msgid = msgctxt = msgstr = "";
				state = 0;
			}
		}

		// Process next file
		if (last && (index+1) < filenames.length) {
			processFiles(fd, filenames, index+1);
		}
	});
}

// Create output file
var crlf = '\n';
fs.open(outputFile, 'w', function(err, fd) {
	// Load all files
	var filenames = [];
	for (var i = 0 ; i < argv._.length ; i++) {
		var name = argv._[i];
		filenames.push(name);
	}

	// Process files
	processFiles(fd, filenames, 0);
});
