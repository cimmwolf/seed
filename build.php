<?php
require_once __DIR__ . '/vendor/autoload.php';

use DenisBeliaev\Build;

$build = new Build();

$build->addFolder('/dist');
$build->addFolder('/img');
$build->addFolder('/node_modules/@webcomponents/webcomponentsjs');

$build->run();
