AutoListing
===========

Better looking and more productive Apache directory listing.


## Installation

# Copy the contents 'build' folder to the 'autolisting' folder in your webroot.
# Add the following rules to the .htaccess in your webroot.

```
#enable directory listing
Options +Indexes

#fancyindexing options
IndexOptions FancyIndexing
IndexOptions FoldersFirst IgnoreCase XHTML NameWidth=*
IndexOptions SuppressHTMLPreamble SuppressRules HTMLTable
IndexOptions SuppressDescription

IndexIgnore readme.html

#add custom header
HeaderName /autolisting/header.php
ReadmeName /autolisting/footer.php

# For the PHP file to execute in a header, need to have a major type of text
AddType text/html .php
AddHandler application/x-httpd-php .php
```