<?php

require_once __DIR__ . '/vendor/autoload.php';

use DenisBeliaev\Build;

$build = new Build();

$build->addPath('/dist');
$build->addPath('/img');
$build->addPath('/node_modules/@webcomponents/webcomponentsjs');
$build->addPath('/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js');

$build->run();
