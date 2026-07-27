<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';

$page      = 'contact';
$pageTitle = 'Contact — LogiSetu';
$pageDesc  = 'Partnership enquiries, investor relations, or general questions — reach out and the LogiSetu team will get back to you.';
$sceneMode = 'grid';

$sent   = (bool) flash_take('contact_sent');
$errors = flash_take('contact_errors') ?? [];
$old    = flash_take('contact_old') ?? [];

/** `?reason=investor` deep link from the footer / investor relations CTA. */
$presetReason = ($_GET['reason'] ?? '') === 'investor' ? 'Investor Relations' : 'General Enquiry';
$selected     = $old['reason'] ?? $presetReason;

require __DIR__ . '/includes/header.php';

component('hero', ['hero' => CONTACT_HERO, 'variant' => 'page']);
?>

<section class="section section--white">
  <div class="shell split split--form">
    <div class="split-copy">
      <p class="eyebrow" data-reveal>Get in Touch</p>
      <h2 class="section-title section-title--left" data-reveal data-reveal-delay="1">We’d like to hear from you</h2>

      <dl class="contact-details" data-reveal data-reveal-delay="2">
        <dt>Email</dt>
        <dd><a href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?></a></dd>

        <dt>Headquarters</dt>
        <dd><?= e(SITE_HQ) ?></dd>

        <dt>Investor Relations</dt>
        <dd>For UAE &amp; UK investor enquiries, use the form and select &ldquo;Investor Relations&rdquo;</dd>
      </dl>
    </div>

    <div class="split-visual" data-reveal data-reveal-delay="2">
      <div class="form-card">
        <?php if ($sent): ?>
          <div class="alert alert--ok" role="status">
            <strong>Thank you — your message has been received.</strong>
            <span>The LogiSetu team will get back to you shortly.</span>
          </div>
        <?php endif; ?>

        <?php if ($errors): ?>
          <div class="alert alert--error" role="alert">
            <strong>Please check the highlighted fields.</strong>
            <ul>
              <?php foreach ($errors as $error): ?>
                <li><?= e($error) ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>

        <form class="contact-form" method="post" action="<?= e(url('handlers/contact-submit.php')) ?>" novalidate>
          <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
          <div class="honey" aria-hidden="true">
            <label for="company_website">Leave this field empty</label>
            <input type="text" id="company_website" name="company_website" tabindex="-1" autocomplete="off">
          </div>

          <div class="field">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required
                   value="<?= e($old['name'] ?? '') ?>"
                   <?= isset($errors['name']) ? 'aria-invalid="true"' : '' ?>>
          </div>

          <div class="field">
            <label for="organisation">Organisation</label>
            <input type="text" id="organisation" name="organisation"
                   value="<?= e($old['organisation'] ?? '') ?>">
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required
                   value="<?= e($old['email'] ?? '') ?>"
                   <?= isset($errors['email']) ? 'aria-invalid="true"' : '' ?>>
          </div>

          <div class="field">
            <label for="reason">Reason</label>
            <select id="reason" name="reason">
              <?php foreach (CONTACT_REASONS as $reason): ?>
                <option value="<?= e($reason) ?>" <?= $selected === $reason ? 'selected' : '' ?>><?= e($reason) ?></option>
              <?php endforeach; ?>
            </select>
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required
                      <?= isset($errors['message']) ? 'aria-invalid="true"' : '' ?>><?= e($old['message'] ?? '') ?></textarea>
          </div>

          <button class="btn btn-gold btn-block" type="submit">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php';
