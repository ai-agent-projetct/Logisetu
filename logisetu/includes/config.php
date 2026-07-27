<?php
/**
 * LogiSetu — global configuration.
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('SITE_NAME', 'LogiSetu');
define('SITE_TAGLINE', 'Logistics Infrastructure for India');
define('SITE_EMAIL', 'vineetgiri007@gmail.com');
define('SITE_HQ', 'Dubai, United Arab Emirates');
define('SITE_YEAR', '2026');

define('ROOT_PATH', dirname(__DIR__));
define('STORAGE_PATH', ROOT_PATH . '/storage');

/**
 * URL path of the app root — empty when served from the document root
 * (e.g. `php -S localhost:8000 -t logisetu`), `/logisetu` when served from a
 * subdirectory.
 *
 * Derived from the running script's directory, then walked back up by however
 * many directories deep that script sits inside the app. Without that step,
 * scripts in `handlers/` would resolve every link relative to `/handlers`.
 */
define('BASE_URL', (static function (): string {
    $normalise = static fn (string $path): string => rtrim(str_replace('\\', '/', $path), '/');

    $base = rtrim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? ''))), '/');
    if ($base === '.') {
        $base = '';
    }

    // How many directories below the app root does the running script sit?
    // realpath normalises separators and resolves any symlinked docroot.
    $scriptDir = realpath(dirname((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')));
    $root      = realpath(ROOT_PATH);
    $depth     = 0;

    if ($scriptDir !== false && $root !== false) {
        $scriptDir = $normalise($scriptDir);
        $root      = $normalise($root);

        // Windows paths are case-insensitive; POSIX ones are not.
        $matches = DIRECTORY_SEPARATOR === '\\'
            ? stripos($scriptDir, $root) === 0
            : str_starts_with($scriptDir, $root);

        if ($matches && $scriptDir !== $root) {
            $depth = substr_count(trim(substr($scriptDir, strlen($root)), '/'), '/') + 1;
        }
    }

    for ($i = 0; $i < $depth && $base !== ''; $i++) {
        $base = rtrim(dirname($base), '/');
        if ($base === '.') {
            $base = '';
        }
    }

    return $base;
})());

/** Primary navigation. Key = page slug used by `$page` in each template. */
const NAV_ITEMS = [
    'home'     => ['label' => 'Home',                 'href' => 'index.php'],
    'about'    => ['label' => 'About',                'href' => 'about.php'],
    'solutions'=> ['label' => 'Solutions',            'href' => 'solutions.php'],
    'network'  => ['label' => 'Network & Investment', 'href' => 'network.php'],
    'insights' => ['label' => 'Insights',             'href' => 'insights.php'],
];

require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/content.php';
