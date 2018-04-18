<?php
/**
 * @author: Denis Beliaev
 */

require __DIR__ . '/vendor/autoload.php';

use DenisBeliaev\Typograph;

function T($filename)
{
    $file = file_get_contents($filename);
    if (preg_match('~^(.+?)(<body.*?>.+?<\/body>)(.+)$~iums', $file, $parts)) {
        unset($parts[0]);
        $parts[2] = Typograph::string($parts[2]);
        file_put_contents($filename, implode('', $parts));
    }
}

$i = 0;
$Iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . '/dist/pages'));
$Regex = new RegexIterator($Iterator, '/^.+\.html$/i', RecursiveRegexIterator::GET_MATCH);
$files = [];
foreach ($Regex as $value)
    $files[] = $value[0];

$i = 0;
foreach ($files as $filename) {
    $content = file_get_contents($filename);
    preg_match_all('~<(?:img|source)[^<>]+srcset=[\'"]{2}[^<>]*>~miu', $content, $matches);
    foreach ($matches[0] as $match) {
        try {
            $adaptiveImg = \DenisBeliaev\AdaptiveImg::adapt($match);
            $content = str_replace($match, $adaptiveImg, $content);
            $i++;
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    file_put_contents($filename, $content);
}
echo "Adapted $i tags" . PHP_EOL;

foreach ($files as $filename) {
    T($filename);
    $i++;
}
echo "Typographed $i files";