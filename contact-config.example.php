<?php
/**
 * Copy this file to contact-config.php on the server and fill it in.
 * contact-config.php is git-ignored so addresses never land in the repository,
 * and .htaccess blocks direct requests to it.
 */
return [
    // Where enquiries are delivered.
    'to' => 'you@example.com',

    // The sender. Use a real mailbox on the site's own domain (create one in
    // cPanel > Email Accounts). Mail "from" an address on another domain is
    // often marked as spam or rejected.
    'from' => 'website@example.com',

    // Optional. Subject line for the notification email.
    'subject' => 'New enquiry from the Weave website',

    // Pass the sender to sendmail (-f). Recommended on cPanel; set to false only
    // if the host rejects it and mail stops arriving.
    'envelope_sender' => true,
];
