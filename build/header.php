<?php

    $titleformat = "{DIR}";


    $uri = urldecode($_SERVER['REQUEST_URI']);
    $uri = preg_replace("/\/ *$/", "", $uri);
    $uri = preg_replace("/\?.*$/", "", $uri);

    $titletext = str_replace("{DIR}", $uri, $titleformat);

    // this is hacky, but in almost every situation there's no real harm.
    // it just might fail if you're doing something funky with directory mappings.
    $pathtext = $uri;

    $xhr = isset($_GET['xhr']);

    if ($xhr)
    {
        require_once('header.xhr.php');
    }
    else
    {
        require_once('header.default.php');
    }