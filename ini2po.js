#!/usr/bin/env node
// webL10n JavaScript ini file to GNU gettext PO file converter

// Template
var starLang = '*';
var enLang = 'en';
var templateFileName = 'template.pot';
var crlf = '\n';
var constHeader = '#. extracted from ';
var constSub1 = [
	'#, fuzzy',
	'msgid ""',
	'msgstr ""',
	'"Project-Id-Version: PACKAGE VERSION\\n"',
	'"Report-Msgid-Bugs-To: \\n"'
];
var constSub2 = '"POT-Creation-Date: ';
var constSub2b = '\\n"';
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
	ini = require('js-ini');

// Get INI filename
var filename = null;
if (process.argv.length != 3) {
	console.log("Usage: ini2po <inifile>");
}
filename = process.argv[2];

// Generate all PO files
if (filename) {
	// Load file
	fs.readFile(filename, 'utf-8', function(err, read) {
		// Parse content
		if (err) throw err;
		var sections = ini.parse(read, {comment: ";;;", autoTyping: false});
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
			content = addContent(constSub2 + new Date().toString() + constSub2b, content);
			content = addContent(constSub3, content);
			content = addCrLf(content);

			// Prepare output file
			var outputname = language + '.po';
			if (language == starLang) {
				outputname = templateFileName;
			}

			// Iterate on each string
			var section = sections[language];
			var items = Object.keys(section);
			for (var j = 0 ; j < items.length ; j++) {
				// Generate lines
				var msgid = defaultSection[items[j]];
				if (msgid == null) {
					console.warn("WARNING: string '"+items[j]+"' in '"+language+"' not in default language");
					continue;
				}
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
				content = addContent('msgctxt "'+items[j]+'"', content);
				content = addContent('msgid "'+msgid.replace(/"/g,'\\"')+'"', content);
				content = addContent('msgstr "'+currentTranslation.replace(/"/g,'\\"')+'"', content);
				content = addCrLf(content);
			}

			// Write file
	 		console.log(outputname + ' generated');
			fs.writeFile(outputname, content, 'utf8', function(err) {
				if (err) throw err;
			});
		}
	});
}
