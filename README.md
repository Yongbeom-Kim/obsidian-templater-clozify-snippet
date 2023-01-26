# Obsidian Clozify Snippet (Templater)

`mklink path_to_symlink_file path_to_main_file`

E.g.
`mklink "C:\Users\<User>\Documents\Obsidian\Vaults\Zettelkasten v3\Templater Scripts\replace_dollar.js" "C:\Users\<User>\Documents\GitHub\obsidian-latex-snippets\build\replace_dollar.js"`

## Templates
Clozify Formatter
```
<% tp.user.anki_clozify_formatter(tp.file.selection(), true) %>
```

No-Pre-Clozify Formatter
```
<% tp.user.anki_clozify_formatter(tp.file.selection(), false) %>
```

Replace Dollar Formatter
```
<% tp.user.replace_dollar(tp.file.selection()) %>
```