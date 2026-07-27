<?php
/**
 * Contact form handler — validates, records the enquiry, redirects back.
 *
 * Enquiries are appended to storage/enquiries.log. Swap the `record_enquiry`
 * body for mail()/SMTP/CRM once a mail transport is configured.
 */

declare(strict_types=1);

require_once __DIR__ . '/../includes/config.php';

$contactUrl = url('contact.php');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Location: ' . $contactUrl, true, 303);
    exit;
}

$input = [
    'name'         => trim((string) ($_POST['name'] ?? '')),
    'organisation' => trim((string) ($_POST['organisation'] ?? '')),
    'email'        => trim((string) ($_POST['email'] ?? '')),
    'reason'       => (string) ($_POST['reason'] ?? 'General Enquiry'),
    'message'      => trim((string) ($_POST['message'] ?? '')),
];

$errors = [];

if (!csrf_verify($_POST['csrf_token'] ?? null)) {
    $errors['csrf'] = 'Your session expired. Please submit the form again.';
}

// Honeypot: real visitors never fill this hidden field.
if (trim((string) ($_POST['company_website'] ?? '')) !== '') {
    header('Location: ' . $contactUrl . '?sent=1', true, 303);
    exit;
}

if ($input['name'] === '') {
    $errors['name'] = 'Please enter your name.';
} elseif (mb_strlen($input['name']) > 120) {
    $errors['name'] = 'Name is too long.';
}

if ($input['email'] === '') {
    $errors['email'] = 'Please enter your email address.';
} elseif (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

if ($input['message'] === '') {
    $errors['message'] = 'Please tell us how we can help.';
} elseif (mb_strlen($input['message']) > 4000) {
    $errors['message'] = 'Message is too long (4000 characters max).';
}

if (!in_array($input['reason'], CONTACT_REASONS, true)) {
    $input['reason'] = 'General Enquiry';
}

if ($errors) {
    flash_set('contact_errors', $errors);
    flash_set('contact_old', $input);
    header('Location: ' . $contactUrl . '#main', true, 303);
    exit;
}

if (record_enquiry($input)) {
    flash_set('contact_sent', true);
} else {
    // Never claim we received a message we failed to store.
    error_log('LogiSetu: could not write enquiry to ' . STORAGE_PATH . '/enquiries.log');
    flash_set('contact_errors', [
        'storage' => 'Sorry — we could not save your message. Please email ' . SITE_EMAIL . ' directly.',
    ]);
    flash_set('contact_old', $input);
}

header('Location: ' . $contactUrl . '#main', true, 303);
exit;

/**
 * Append the enquiry to a newline-delimited JSON log.
 *
 * @return bool Whether the enquiry was durably recorded.
 */
function record_enquiry(array $input): bool
{
    if (!is_dir(STORAGE_PATH) && !@mkdir(STORAGE_PATH, 0775, true) && !is_dir(STORAGE_PATH)) {
        return false;
    }

    $record = $input + [
        'received_at' => gmdate('c'),
        'ip'          => $_SERVER['REMOTE_ADDR'] ?? null,
    ];

    $line = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
    $file = STORAGE_PATH . '/enquiries.log';

    // LOCK_EX is unsupported on some streams (certain network shares, and PHP
    // compiled to WASM). Warnings here would be emitted before the redirect
    // header, so suppress them and fall back to an unlocked append.
    $written = @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    if ($written === false) {
        $written = @file_put_contents($file, $line, FILE_APPEND);
    }

    return $written !== false;
}
