<?php
require_once __DIR__ . '/config.php';

use DenisBeliaev\Typograph;

$matches = [];
if (preg_match('#^(.*?)@(\d+|-)x(\d+|-)\.(gif|jpe?g|png)$#', $_SERVER['REQUEST_URI'], $matches)) {
    if (($newW = $matches[2]) == '-')
        $newW = -1;
    if (($newH = $matches[3]) == '-')
        $newH = -1;

    $filePath = __DIR__ . $matches[1] . '.' . $matches[4];

    switch ($matches[4]) {
        case 'gif':
            header('Content-Type: image/gif');
            break;
        case 'jpg':
            header('Content-Type: image/jpeg');
            break;
        case 'jpeg':
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
} elseif ($_SERVER['REQUEST_URI'] == '/') {
    buildSiteMap();
    display(__DIR__ . '/src/pages/index.php');
} else {
    $uri = trim($_SERVER['REQUEST_URI'], "/");
    if (file_exists($file = __DIR__ . '/src/pages/' . $uri . '.php')) {
        buildSiteMap();
        display($file);
    } else
        return false;
}

function display($file)
{
    ob_start();
    require $file;
    $content = ob_get_contents();
    ob_end_clean();
    if (preg_match('~^(.+?)(<body.*?>.+?<\/body>)(.+)$~iums', $content, $parts)) {
        unset($parts[0]);
        $parts[2] = Typograph::string($parts[2]);
        $content = implode('', $parts);
    }
    echo $content;
}

function recursiveRemoveDirectory($directory)
{
    foreach (glob("{$directory}/*") as $file) {
        if (is_dir($file))
            recursiveRemoveDirectory($file);
        else
            unlink($file);
    }
    rmdir($directory);
}

function buildSiteMap()
{
    $path = __DIR__ . '/dist/sitemap';

    if (is_dir($path))
        recursiveRemoveDirectory($path);

    $sitemap = new SimpleXMLElement(__DIR__ . '/sitemap.xml', 0, true);
    foreach ($sitemap as $url) {
        $dir = $path . parse_url($url->loc, PHP_URL_PATH);
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
    }
}