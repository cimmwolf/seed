<?php
/**
 * @author: Denis Beliaev
 */
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
} elseif ($_SERVER['REQUEST_URI'] == '/')
    require __DIR__ . '/src/index.php';
else
    return false;