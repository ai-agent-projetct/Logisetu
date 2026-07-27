<?php
/**
 * Shared template + form helpers.
 */

declare(strict_types=1);

/** Escape for HTML output. */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Build an absolute-from-root URL for an asset or page. */
function url(string $path): string
{
    return BASE_URL . '/' . ltrim($path, '/');
}

/** Cache-busting asset URL so CSS/JS edits show up immediately in dev. */
function asset(string $path): string
{
    $file = ROOT_PATH . '/' . ltrim($path, '/');
    $version = is_file($file) ? (string) filemtime($file) : SITE_YEAR;

    return url($path) . '?v=' . $version;
}

/** Render a partial with an isolated scope. */
function component(string $name, array $data = []): void
{
    extract($data, EXTR_SKIP);
    include ROOT_PATH . '/includes/components/' . $name . '.php';
}

/**
 * Inline SVG icon set. Stroke-based, 1.6px weight — matches the design's
 * light line icons sitting inside soft gold tiles.
 */
function icon(string $name, string $class = 'icon'): string
{
    $paths = [
        'warehouse'  => '<path d="M3 21V10.5L12 4l9 6.5V21"/><path d="M9 21v-6h6v6"/>',
        'terminal'   => '<rect x="3" y="5" width="7" height="6" rx="1"/><rect x="14" y="5" width="7" height="6" rx="1"/><path d="M6.5 11v4M17.5 11v4M4 19h16"/>',
        'coldchain'  => '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M9 5l3-2 3 2M9 19l3 2 3-2"/>',
        'ecommerce'  => '<path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
        'customs'    => '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/>',
        'tech'       => '<rect x="2.5" y="4" width="19" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7.5 10.5l2-2 2 2 3-3"/>',
        'globe'      => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 4 5.7 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.7-4-9s1.4-6.3 4-9Z"/>',
        'layers'     => '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13.5 12 18l9-4.5"/>',
        'corridor'   => '<path d="M20 5 8.5 16.5"/><path d="M20 5v6M20 5h-6"/><path d="M4 20l4.5-3.5"/>',
        'shield'     => '<path d="M12 3 5 6v5.5c0 4.2 2.8 7.8 7 9.5 4.2-1.7 7-5.3 7-9.5V6l-7-3Z"/><path d="m9.2 12.2 2 2 3.6-3.8"/>',
        'building'   => '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
        'pin'        => '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
        'people'     => '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.3a3 3 0 0 1 0 5.4M17.5 20a6 6 0 0 0-2.3-4.7"/>',
        'bridge'     => '<path d="M3 16a9 9 0 0 1 18 0"/><path d="M3 16v3M21 16v3M12 8.2V19M7.5 10.6V19M16.5 10.6V19"/>',
        'check'      => '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        'arrow'      => '<path d="M5 12h14M13 6l6 6-6 6"/>',
        'menu'       => '<path d="M4 7h16M4 12h16M4 17h16"/>',
        'close'      => '<path d="M6 6l12 12M18 6 6 18"/>',
    ];

    $body = $paths[$name] ?? $paths['arrow'];

    return '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        . 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
        . $body . '</svg>';
}

/** CSRF token for the contact form. */
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function csrf_verify(?string $token): bool
{
    return is_string($token)
        && !empty($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

/** Pull one-shot flash data set by the contact handler. */
function flash_take(string $key): mixed
{
    if (!isset($_SESSION['flash'][$key])) {
        return null;
    }

    $value = $_SESSION['flash'][$key];
    unset($_SESSION['flash'][$key]);

    return $value;
}

function flash_set(string $key, mixed $value): void
{
    $_SESSION['flash'][$key] = $value;
}
