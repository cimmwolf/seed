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
foreach ($files as $filename) {
    T($filename);
    $i++;
}

echo "Typographed $i files";