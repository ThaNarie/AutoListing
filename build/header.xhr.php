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

?>
<div class="autolisting-container">
    <div class="autolisting-path"><?php echo $pathtext; ?></div>
    <div class="autolisting-table">