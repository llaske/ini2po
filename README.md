ini2po is a command script to generate [gettext PO files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html) from [INI file formatted for webl10n](https://github.com/fabi1cazenave/webL10n).

	node ini2po.js <inifile>

ini2po looks for a default language section [*]. If it finds it, it generates a template.POT file using this section.
