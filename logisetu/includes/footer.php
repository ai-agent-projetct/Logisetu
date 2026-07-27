<?php declare(strict_types=1); ?>
</main>

<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="footer-logo" src="<?= e(asset('assets/img/logo-full-light.png')) ?>"
             width="1109" height="420" alt="<?= e(SITE_NAME) ?> — Bridging distances, delivering possibilities">
        <p>Logistics infrastructure for India, backed by a global capital and investor network across the UAE and UK.</p>
      </div>

      <?php foreach (FOOTER_COLUMNS as $heading => $links): ?>
        <nav class="footer-col" aria-label="<?= e($heading) ?>">
          <h2 class="footer-head"><?= e($heading) ?></h2>
          <ul>
            <?php foreach ($links as $link): ?>
              <li><a href="<?= e(url($link['href'])) ?>"><?= e($link['label']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </nav>
      <?php endforeach; ?>

      <div class="footer-col">
        <h2 class="footer-head">Head Office</h2>
        <p class="footer-address"><?= e(SITE_HQ) ?></p>
      </div>
    </div>

    <div class="footer-base">
      <p>&copy; <?= e(SITE_YEAR) ?> <?= e(SITE_NAME) ?>. All rights reserved.</p>
      <p class="footer-locales">Logistics Infrastructure &middot; Dubai &middot; London &middot; India</p>
    </div>
  </div>
</footer>

<script type="module" src="<?= e(asset('assets/js/scene.js')) ?>"></script>
<script src="<?= e(asset('assets/js/main.js')) ?>" defer></script>
</body>
</html>
