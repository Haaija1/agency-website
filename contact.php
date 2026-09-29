<?php
/**
 * Weave contact form handler (cPanel / shared PHP hosting).
 *
 * Receives the form on index.html, checks it, and emails it to the address in
 * contact-config.php (copy contact-config.example.php and fill it in; that file
 * is not committed). Written for PHP 7.4+ so it runs on older cPanel plans.
 *
 * Spam defences, kept simple on purpose for a low-traffic site:
 *   - honeypot field ("website"): filled means bot, pretend it worked
 *   - time-on-page ("t", milliseconds, sent by site.js): implausibly fast sends are refused
 *   - same-site check on Origin / Referer
 *   - a few messages per IP per hour
 * Nothing is stored: the message goes to the inbox and only a short-lived
 * throttle counter (a hash of the IP) is written to the system temp directory.
 */

const WEAVE_MIN_FILL_MS = 3000;   // faster than this after page load is not a person
const WEAVE_MAX_PER_HOUR = 5;     // per IP

$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

/**
 * Send the response and stop. JSON for the fetch() enhancement in site.js,
 * a small page styled with styles.css for a plain form post.
 */
function weave_respond($ok, $message, $status = 200, array $errors = [])
{
    global $wantsJson;

    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');

    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        $body = ['ok' => $ok, 'message' => $message];
        if ($errors) {
            $body['errors'] = $errors;
        }
        echo json_encode($body);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $title = $ok ? 'Note sent' : 'Note not sent';
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . $title . ' — Weave</title>'
        . '<link rel="stylesheet" href="styles.css"></head><body><main id="main"><section><div class="wrap">'
        . '<p class="kicker">' . $title . '</p><h2>' . $safe . '</h2>';
    foreach ($errors as $err) {
        echo '<p class="lede">' . htmlspecialchars($err, ENT_QUOTES, 'UTF-8') . '</p>';
    }
    echo '<p class="lede"><a href="./#contact">Back to the site</a></p>'
        . '</div></section></main></body></html>';
    exit;
}

function weave_length($s)
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

/** Trim and drop control characters; keep newlines and tabs only when asked. */
function weave_clean($value, $multiline = false)
{
    $value = is_string($value) ? $value : '';
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $pattern = $multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/';
    return trim(preg_replace($pattern, $multiline ? '' : ' ', $value));
}

/** True when this IP has already sent too many messages in the last hour. */
function weave_throttled($ip)
{
    $file = sys_get_temp_dir() . '/weave-contact-' . hash('sha256', $ip) . '.json';
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $stored = json_decode((string) @file_get_contents($file), true);
        if (is_array($stored)) {
            foreach ($stored as $when) {
                if (is_int($when) && $when > $now - 3600) {
                    $hits[] = $when;
                }
            }
        }
    }
    if (count($hits) >= WEAVE_MAX_PER_HOUR) {
        return true;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX); // if this fails, we simply don't throttle
    return false;
}

// ---- Request checks -------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    weave_respond(false, 'This page only accepts the contact form.', 405);
}

$source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($source !== '') {
    $sourceHost = strtolower((string) parse_url($source, PHP_URL_HOST));
    $ownHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
    if ($sourceHost === '' || $sourceHost !== $ownHost) {
        weave_respond(false, 'The form must be sent from the Weave website.', 403);
    }
}

// ---- Config ---------------------------------------------------------------

$configFile = __DIR__ . '/contact-config.php';
$config = is_file($configFile) ? include $configFile : null;
if (
    !is_array($config)
    || empty($config['to']) || !filter_var($config['to'], FILTER_VALIDATE_EMAIL)
    || empty($config['from']) || !filter_var($config['from'], FILTER_VALIDATE_EMAIL)
) {
    error_log('weave contact form: contact-config.php is missing or invalid');
    weave_respond(false, 'The form is not switched on yet. Please message us on WhatsApp instead.', 503);
}

// ---- Spam checks ----------------------------------------------------------

if (weave_clean($_POST['website'] ?? '') !== '') {
    weave_respond(true, 'Thanks, we’ve got your note. We’ll reply soon.'); // honeypot: say nothing useful to bots
}

$elapsed = $_POST['t'] ?? '';
if (is_string($elapsed) && ctype_digit($elapsed) && (int) $elapsed < WEAVE_MIN_FILL_MS) {
    weave_respond(false, 'That was very quick. Please check your note and send it again.', 422);
}

// ---- Validate -------------------------------------------------------------

$name = weave_clean($_POST['name'] ?? '');
$email = weave_clean($_POST['email'] ?? '');
$message = weave_clean($_POST['message'] ?? '', true);

$errors = [];
if ($name === '' || weave_length($name) > 100) {
    $errors['name'] = 'Please enter your name.';
}
if ($email === '' || weave_length($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address, like name@company.com.';
}
if (weave_length($message) < 10) {
    $errors['message'] = 'Please add a little more detail (at least 10 characters).';
} elseif (weave_length($message) > 3000) {
    $errors['message'] = 'Please keep it under 3,000 characters.';
}
if ($errors) {
    weave_respond(false, 'Please check the highlighted fields.', 422, $errors);
}

if (weave_throttled($_SERVER['REMOTE_ADDR'] ?? 'unknown')) {
    header('Retry-After: 3600');
    weave_respond(false, 'You have sent a few notes already. Please try again later, or message us on WhatsApp.', 429);
}

// ---- Send -----------------------------------------------------------------

$subject = (isset($config['subject']) && is_string($config['subject']) && $config['subject'] !== '')
    ? weave_clean($config['subject'])
    : 'New enquiry from the Weave website';

$body = "Name: $name\n"
    . "Email: $email\n"
    . 'Sent: ' . gmdate('Y-m-d H:i') . " UTC\n\n"
    . $message . "\n";

// $email has passed FILTER_VALIDATE_EMAIL and weave_clean(), so it cannot carry extra headers.
$headers = implode("\r\n", [
    'From: Weave website <' . $config['from'] . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$params = !empty($config['envelope_sender']) ? '-f' . $config['from'] : '';

$sent = $params !== ''
    ? mail($config['to'], $subject, $body, $headers, $params)
    : mail($config['to'], $subject, $body, $headers);

if (!$sent) {
    error_log('weave contact form: mail() returned false');
    weave_respond(false, 'Sorry, that did not send. Please message us on WhatsApp instead.', 500);
}

weave_respond(true, 'Thanks, we’ve got your note. We’ll reply soon.');
