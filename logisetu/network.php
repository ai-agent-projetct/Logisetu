<?php
declare(strict_types=1);

$page      = 'network';
$pageTitle = 'Network & Investment — LogiSetu';
$pageDesc  = 'LogiSetu connects on-the-ground logistics infrastructure delivery in India with a strategic investor and NRI capital network spanning the UAE and United Kingdom.';
$sceneMode = 'orbit';

require __DIR__ . '/includes/header.php';

component('hero', ['hero' => NETWORK_HERO, 'variant' => 'page']);
?>

<section class="section section--white">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => NETWORK_FOOTPRINT['eyebrow'],
        'title'   => NETWORK_FOOTPRINT['title'],
    ]); ?>

    <div class="grid grid-3">
      <?php foreach (NETWORK_FOOTPRINT['items'] as $i => $item): ?>
        <article class="card card--topline" data-tilt data-reveal data-reveal-delay="<?= (int) $i ?>">
          <span class="card-icon"><?= icon($item['icon']) ?></span>
          <h3 class="card-title"><?= e($item['title']) ?></h3>
          <p class="card-body"><?= e($item['body']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--light">
  <div class="shell split">
    <div class="split-copy">
      <p class="eyebrow" data-reveal><?= e(NETWORK_CAPITAL['eyebrow']) ?></p>
      <h2 class="section-title section-title--left" data-reveal data-reveal-delay="1"><?= e(NETWORK_CAPITAL['title']) ?></h2>
      <?php foreach (NETWORK_CAPITAL['body'] as $i => $para): ?>
        <p class="prose" data-reveal data-reveal-delay="<?= $i + 2 ?>"><?= e($para) ?></p>
      <?php endforeach; ?>

      <ul class="check-list" data-reveal data-reveal-delay="4">
        <?php foreach (NETWORK_CAPITAL['checks'] as $check): ?>
          <li><span class="check-dot"><?= icon('check') ?></span><?= e($check) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="split-visual" data-reveal data-reveal-delay="2">
      <div class="visual-frame">
        <div class="visual-canvas"
             data-globe-canvas
             data-globe-theme="light"
             role="img"
             aria-label="An interactive globe showing LogiSetu's multimodal freight network: air cargo, sea freight, rail and road corridors linking India, Dubai and London."></div>
      </div>
    </div>
  </div>
</section>

<?php
component('cta', ['cta' => NETWORK_IR, 'tone' => 'dark']);

require __DIR__ . '/includes/footer.php';
