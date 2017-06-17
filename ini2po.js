// webL10n JavaScript ini file to GNU gettext PO file converter

// Template
var starLang = '*';
var enLang = 'en';
var crlf = '\n';
var constHeader = '#. extracted from ';
var constSub1 = [
	'#, fuzzy',
	'msgid ""',
	'msgstr ""',
	'"Project-Id-Version: PACKAGE VERSION\\n"',
	'"Report-Msgid-Bugs-To: \\n"'
];
var constSub2 = 'POT-Creation-Date: ';
var constSub3 = [
	'"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"',
	'"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"',
	'"Language-Team: LANGUAGE <LL@li.org>\\n"',
	'"MIME-Version: 1.0\\n"',
	'"Content-Type: text/plain; charset=UTF-8\\n"',
	'"Content-Transfer-Encoding: 8bit\\n"',
	'"X-Generator: ini2po 0.0.1\\n"'
];
var constComment = '#. Do not translate';

// Generate function
function addContent(content, from) {
	var to = from;
	if (!content) {
		return to;
	}
	if (content instanceof Array) {
		for (var i = 0 ; i < content.length ; i++) {
			var subcontent = content[i];
			if (subcontent) {
				to += subcontent + crlf;
			}
		}
	} else {
		to += content + crlf;
	}
	return to;
}
function addCrLf(content) {
	return content + crlf;
}

// Require
var	fs = require('fs'),
	ini = require('ini');

// Get INI filename
var filename = null;
if (process.argv.length != 3) {
	console.log("Usage: "+process.argv[0]+" ini2po.js <inifile>");
}
filename = process.argv[2];

// Generate all PO files
if (filename) {
	// Load file
	fs.readFile(filename, 'utf-8', function(err, read) {
		// Parse content
		if (err) throw err;
		var sections = ini.parse(read);
		var keys = Object.keys(sections);

		// Find default
		var defaultSectionIndex = null;
		for (var i = 0 ; i < keys.length ; i++) {
			var language = keys[i];
			if (language == starLang) {
				defaultSectionIndex = language;
				break;
			} else if (language == enLang && defaultSectionIndex == null) {
				defaultSectionIndex = language;
			}
		}
		if (defaultSectionIndex == null) {
			console.log("no default language");
			return;
		}
		var defaultSection = sections[defaultSectionIndex];

		// Iterate on each section
		for (var i = 0 ; i < keys.length ; i++) {
			// Generate header
			var language = keys[i];
			var content = '';
			content = addContent(constHeader + filename, content);
			content = addContent(constSub1, content);
			content = addContent(constSub2 + new Date().toString(), content);
			content = addContent(constSub3, content);
			content = addCrLf(content);

			// Iterate on each string
			var section = sections[language];
			var items = Object.keys(section);
			for (var j = 0 ; j < items.length ; j++) {
				// Generate lines
				var msgid = defaultSection[items[j]];
				var currentTranslation = section[items[j]];
				var res = msgid.match(/{{[^}}]+}}/g);
				if (res && res.length) {
					var comment = constComment;
					for (var k = 0 ; k < res.length ; k++) {
						comment += ' ' + res[k];
					}
					content = addContent(comment, content);
				}
				content = addContent('#: '+items[j], content);
				content = addContent('msgctx "'+items[j]+'"', content);
				content = addContent('msgid "'+msgid+'"', content);
				if (language != defaultSectionIndex && msgid == currentTranslation) {
					content = addContent('msgstr ""', content);
				} else {
					content = addContent('msgstr "'+currentTranslation+'"', content);
				}
				content = addCrLf(content);
			}

			// Write file
			var outputname = language + '.po';
	 		console.log(outputname + ' generated');
			fs.writeFile(outputname, content, 'utf8', function(err) {
				if (err) throw err;
			});
		}
	});
}
