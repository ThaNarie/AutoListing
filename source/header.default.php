<?php

    function isHttps()
    {
        if (!empty($_SERVER['HTTPS'])) {
            return true;
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
            return true;
        }
        if (!empty($_SERVER['PORT']) && $_SERVER['PORT'] == 443) {
            return true;
        }

        return false;
    }

    function getProtocol()
    {
        return isHttps() ? 'https:' : 'http:';
    }

    $basepath = getProtocol() . '//' . $_SERVER['HTTP_HOST'] . substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], '/')) . '/';

?><!doctype html>
<!--[if IE 8]> <html class="no-js lt-ie10 lt-ie9"> <![endif]-->
<!--[if IE 9]><html class="no-js lt-ie10"><![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width" />

        <title><?php echo $titletext; ?></title>

        <meta name="basehref" content="<?php echo $basepath ?>" />
        <base href="<?php echo $basepath ?>" />

        <link href="<?php echo $basepath ?>inc/style/screen.css" rel="stylesheet" type="text/css" />

        <script>

            // todo: move to bootstrap
            var ua = (navigator.userAgent||navigator.vendor||window.opera);
            window['isMobile'] = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4)));

            if (window['isMobile'])
            {
                document.getElementsByTagName('html')[0].className += " is-mobile";
            }
        </script>
    </head>
    <body data-gaia-container="main">

        <div class="wrapper">
            <div class="listing disabled" data-bind="css: 'search-' + searchMode()">
                <header>
                    <div class="info">
                        <p class="copyright">&copy;Tha Narie</p>
                        <p class="path-mobile" data-bind="with: pathItems()[pathItems().length - 1]">
                            <a href="#" class="path-item" data-bind="text: '.....&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;' + name, attr: {href: link, title: label}, click: $root.controller.expandPathOnMobile.bind($root.controller)"></a>
                        </p>
                        <p class="path" data-bind="foreach: pathItems"><a href="#" class="path-item" data-bind="text:name, attr: {href: link, title: label}, click: $root.controller.onPathItemClick.bind($root.controller)"></a><span class="seperator"> / </span></p>
                    </div>

                    <!--            <ul class="favs list" data-bind="template: {'name': 'fav', foreach: favs}">-->
                    <!--            </ul>-->

                    <div class="search-wrapper">
                        <div class="search">
                            <span class="search-selected" data-bind="html: selectedSearchText"></span>
                            <input id="search" type="text" data-bind="value: search, valueUpdate: 'afterkeydown'" autocomplete="off"/>
                        </div>

                        <div class="sort">
                            <a class="name" data-filter="name" data-bind="css: {'active-top': activeFilter() == 'name' && activeFilterDirection() == true, 'active-bottom': activeFilter() == 'name' && activeFilterDirection() == false}">Name</a> |
                            <a class="size" data-filter="size" data-bind="css: {'active-top': activeFilter() == 'size' && activeFilterDirection() == true, 'active-bottom': activeFilter() == 'size' && activeFilterDirection() == false}">Size</a> |
                            <a class="date" data-filter="date" data-bind="css: {'active-top': activeFilter() == 'date' && activeFilterDirection() == true, 'active-bottom': activeFilter() == 'date' && activeFilterDirection() == false}">Date</a> |
                            <a class="date" data-filter="type" data-bind="css: {'active-top': activeFilter() == 'type' && activeFilterDirection() == true, 'active-bottom': activeFilter() == 'type' && activeFilterDirection() == false}">Type</a>
                        </div>
                    </div>
                </header>

                <div class="content">

                    <ul class="items list" data-bind="template: {'name': 'item', foreach: filteredItems}">
                    </ul>
                </div>
            </div>

            <div class="help">
                <div class="panel">
                    <p class="heading-01">Help<span data-bind="click: $root.controller.closeHelp.bind($root.controller)">+</span></p>
                    <div class="shortcuts">
                        <p class="heading-02">Keyboard Shortcuts</p>
                        <dl>
                            <dt>Shift + /, ?</dt>
                            <dd>Displays this screen, <span style="color: black;">Esc</span> to close</dd>

                            <dt>Enter, Tab</dt>
                            <dd>Navigates to the selected file of folder</dd>

                            <dt>Ctrl + Backspace, Shift + Tab</dt>
                            <dd>Navigates to the parent folder</dd>

                            <dt>Shift + Enter</dt>
                            <dd>Navigates to the selected file or folder forcing a page load</dd>

                            <dt>Alt + Enter</dt>
                            <dd>Navigates to the selected file or folder in a new window</dd>

                            <dt>Ctrl + Shift + F</dt>
                            <dd>Toggles between search and filter mode</dd>

                            <dt>Esc</dt>
                            <dd>Clears the current search/filter</dd>
                        </dl>
                    </div>
                    <div class="explanation">
                        <p class="heading-02">Info</p>

                        <p class="title-01">Search mode</p>
                        <p>Works the same as in Windows Explorer or OSX Finder, typing letters jumps to the corresponding item.</p>

                        <p class="title-01">Filter mode</p>
                        <p>Filters down the list while you type, sorting it in relevance, can be useful for searching within folder names instead of from the start.</p>

                        <p class="title-01">Feature requests or bugs?</p>
                        <p>Visit <a href="https://github.com/ThaNarie/AutoListing/issues">github.com/ThaNarie</a> to suggest new features or to report bugs!</p>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/html" id="fav"><li class="dir">
            <span class="icon fav"></span>
            <span class="name" data-bind="text: name"></span>
            </li></script>

        <script type="text/html" id="item"><li data-bind="css: {'selected': !isMobile && $data == $root.selectedItem(), 'dir': isDir}">
            <a href="#" target="_blank" data-bind="attr: {href: $root.controller.basePath + '/' + name}">
                <span class="icon" data-bind="css: $root.getIcon($data)"></span>
                <span class="name" data-bind="text: name"></span>
                <span class="date" data-bind="text: $root.getDate(date), attr: {title: moment(date).format('MMMM D YYYY HH:mm:ss')}"></span>
                <span class="size" data-bind="text: $root.getSize(size), attr: {title: sizeValue + ' bytes'}"></span>
                <span class="size-viz" data-bind="style: {'width': $root.getSizeNumber(sizeValue) + 'px'}"></span>
                <span class="date-viz" data-bind="style: {'width': $root.getDateNumber(date) + 'px'}"></span>
            </a>
            </li></script>

        <div id="pagecontainer autolisting-container" style="display: none;">
            <div class="autolisting-path"><?php echo $pathtext; ?></div>
            <div class="autolisting-table">
