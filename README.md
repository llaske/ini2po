
### Setup

	git clone https://github.com/llaske/ini2po.git 
	cd ini2po
	npm install -g

### Convert INI to PO

**ini2po** is a command script to generate [gettext PO files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html) from [INI file formatted for webl10n](https://github.com/fabi1cazenave/webL10n).

	ini2po <inifile>

ini2po looks for a default language section `[*]`. If it finds it, it generates a `template.pot` file using this section.


### Convert PO to INI

**po2ini** is the reverse command: it takes a set of [gettext PO files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html) and convert it to an unique [INI file formatted for webl10n](https://github.com/fabi1cazenave/webL10n).

	po2ini [-o <outputfile>] <pofile1> [<pofile2> ...]

po2ini replaces content of the `template.pot` file by a default language section `[*]`.
