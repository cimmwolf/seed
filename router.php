<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE);

require_once __DIR__ . '/vendor/autoload.php';

use DenisBeliaev\{AdaptiveImg, Typograph};

define('ROOT', __DIR__);
define('PAGES', __DIR__ . '/src/pages');

if (strpos($_SERVER['REQUEST_URI'], '.php') !== false) {
    $urlPath = str_replace(['/src/pages/', '.php'], ['/', ''], $_SERVER['REQUEST_URI']);
    define('URL_PATH', $urlPath);
} else {
    define('URL_PATH', $_SERVER['REQUEST_URI']);
}


if ($_SERVER['SERVER_SOFTWARE'] == 'php-cgi') {
    define('REQUEST_URI', str_replace(['/src/pages', '.php'], '', $_SERVER['REQUEST_URI']));
} else {
    define('REQUEST_URI', $_SERVER['REQUEST_URI']);
}

$matches = [];
if (preg_match('#^(.*?)@(\d+|-)x(\d+|-)\.(gif|jpe?g|png)$#', REQUEST_URI, $matches)) {
    if (($newW = $matches[2]) == '-') {
        $newW = -1;
    }
    if (($newH = $matches[3]) == '-') {
        $newH = -1;
    }

    $filePath = __DIR__ . $matches[1] . '.' . $matches[4];

    switch ($matches[4]) {
        case 'gif':
            header('Content-Type: image/gif');
            break;
        case 'jpeg':
        case 'jpg':
            header('Content-Type: image/jpeg');
            break;
        case 'png':
            header('Content-Type: image/png');
            $image = imagecreatefrompng($filePath);
            $image = imagescale($image, $newW, $newH);
            imagealphablending($image, true);
            imagesavealpha($image, true);
            imagepng($image);
            break;
    }

    if (!isset($image)) {
        $image = imagecreatefromjpeg($filePath);
        $image = imagescale($image, $newW, $newH);
        imagejpeg($image);
    }
    imagedestroy($image);
} elseif (preg_match('#^/(node_modules|components)/.*.js$#', REQUEST_URI)) {
    ob_start();
    require __DIR__ . REQUEST_URI;
    $content = ob_get_contents();
    ob_end_clean();
    header('Content-type: application/javascript');
    echo str_replace(
        ['@polymer/', '@webcomponents/', '@vistro/'],
        ['/node_modules/@polymer/', '/node_modules/@webcomponents/', '/node_modules/@vistro/'],
        $content
    );
} elseif (REQUEST_URI == '/') {
    display(__DIR__ . '/src/pages/index.php');
} else {
    $uri = trim(REQUEST_URI, "/");
    if (file_exists($file = __DIR__ . '/public/' . $uri)) {
        display($file);
    } elseif (file_exists($file = __DIR__ . '/src/pages/' . $uri . '.php')) {
        display($file);
    } elseif (!file_exists(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
        display(__DIR__ . '/src/pages/404.php');
    } else {
        return false;
    }
}

function display($file)
{
    ob_start();
    require $file;
    $content = ob_get_contents();
    ob_end_clean();

    $mime = mime_content_type($file);

    if ($mime == 'text/html') {
        preg_match_all('~<(?:img|source)[^<>]+srcset=[\'"]{2}[^<>]*>~miu', $content, $matches);
        foreach ($matches[0] as $match) {
            try {
                $adaptiveImg = AdaptiveImg::adapt($match);
                $content = str_replace($match, $adaptiveImg, $content);
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }

        if (preg_match('~^(.+?)(<body.*?>.+?</body>)(.+)$~iums', $content, $parts)) {
            unset($parts[0]);
            $parts[2] = Typograph::string($parts[2]);
            $content = implode('', $parts);
        }

        $content = str_replace(
            [
                '/src/sass/style.sass',
                '/src/js/script.js'
            ],
            [
                '/dist/css/style.css',
                '/dist/js/script.js',
            ],
            $content
        );
    }

    header("Content-Type: $mime");
    echo $content;
}
