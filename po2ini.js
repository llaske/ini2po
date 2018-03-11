// GNU gettext PO to webL10n JavaScript ini file converter

// Require
var	fs = require('fs'),
	readline = require('readline'),
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

// Create output file
var crlf = '\n';
fs.open(outputFile, 'w', function(err, fd) {
	// Load all files
	for (var i = 0 ; i < argv._.length ; i++) {
		// Process file
		var name = argv._[i];
		var processFile = function(filename) {
			var basename = path.basename(filename);
			var sectioname = (basename == defaultTemplateFile ? "*" : basename.substr(0,basename.indexOf(".")));

			// Load all lines
			var lineReader = readline.createInterface({
				input: fs.createReadStream(filename, {options: 'utf-8'})
			});
			var state = -1;
			var msgctxt = "";
			var msgid = "";
			var msgstr = "";
			lineReader.on('line', function(line) {
				// Write setHeader
				if (state == -1) {
					console.log("Process "+filename+"...")
					fs.write(fd, crlf+"["+sectioname+"]"+crlf);
					state = 0;
				}

				// Look for msgctxt
				else if (state == 0) {
					var result = line.match(/msgctxt\s*"([^"]*)"/);
					if (result && result.length > 1) {
						msgctxt = result[1];
						state = 1;
					}
				}

				// Look for msgid
				else if (state == 1) {
					var result = line.match(/msgid\s*"([^"]*)"/);
					if (result && result.length > 1) {
						msgid = result[1];
						state = 2;
					}
				}

				// Look for msgstr
				else if (state == 2) {
					var result = line.match(/msgstr\s*"([^"]*)"/);
					if (result && result.length > 1) {
						msgstr = result[1];
						fs.write(fd, msgctxt + "=" + msgstr + crlf);
						state = 0;
					}
				}
			});
		}
		processFile(name);
	}
});
