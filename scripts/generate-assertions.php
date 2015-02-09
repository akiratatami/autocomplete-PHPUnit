<?php

/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */

require __DIR__ . '/vendor/autoload.php';

/* @var string[][] $assertions */
$assertions = [];
$reflection = new ReflectionClass(PHPUnit_Framework_TestCase::class);

/* @var ReflectionMethod $method */
foreach ($reflection->getMethods() as $method) {
    // not an assert? continue!
    if (substr($method->getName(), 0, 6) !== 'assert') {
        continue;
    }

    /* @var string[] $args */
    $args = [];

    /* @var ReflectionParameter $parameter */
    foreach ($method->getParameters() as $parameter) {
        if ($parameter->getName() === 'message') {
            break;
        }

        $args[] = sprintf(
            '$%s',
            $parameter->getName()
        );
    }

    // ignore assertPreConditions, assertPostConditions, ...
    if (count($args) <= 1) {
        continue;
    }

    $assertions[] = [
        'name' => $method->getName(),
        'args' => $args
    ];
}

echo json_encode(
    $assertions,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
);
