
ini2po is a command script to generate [https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html](gettext PO files) from [https://github.com/fabi1cazenave/webL10n](INI file formatted for webl10n).

	node ini2po.js <inifile>

ini2po first look for a default language section [en] or [*]. If a translated string has the same value than in the default section, the string text is set to an empty string.

