<?php
require_once __DIR__ . '/vendor/autoload.php';

define('WEB_ROOT', __DIR__);
if (strpos($_SERVER['REQUEST_URI'], '.php') !== false) {
    $urlPath = str_replace(['/src/pages/', '.php'], '/', $_SERVER['REQUEST_URI']);
    define('URL_PATH', $urlPath);
} else
    define('URL_PATH', $_SERVER['REQUEST_URI']);