<?php
declare(strict_types=1);

$page      = 'home';
$pageTitle = 'LogiSetu — Engineering India’s Next-Generation Logistics Infrastructure';
$pageDesc  = 'LogiSetu designs, develops and operates multimodal logistics parks, freight terminals and trade infrastructure across India — connecting global capital with local execution.';
$sceneMode = 'yard';

require __DIR__ . '/includes/header.php';

component('hero', [
    'hero'    => HOME_HERO,
    'variant' => 'lead',
    'cards'   => HOME_HERO_CARDS,
]);
?>

<section class="statement">
  <div class="shell statement-inner" data-reveal>
    <img class="statement-mark" src="<?= e(asset('assets/img/logo-mark.png')) ?>"
         width="862" height="200" alt="" aria-hidden="true">
    <p><?= e(HOME_STATEMENT) ?></p>
  </div>
</section>

<section class="section section--white">
  <div class="shell split">
    <div class="split-copy">
      <p class="eyebrow" data-reveal><?= e(HOME_OPPORTUNITY['eyebrow']) ?></p>
      <h2 class="section-title section-title--left" data-reveal data-reveal-delay="1"><?= e(HOME_OPPORTUNITY['title']) ?></h2>

      <?php foreach (HOME_OPPORTUNITY['body'] as $i => $para): ?>
        <p class="prose" data-reveal data-reveal-delay="<?= $i + 2 ?>"><?= $para /* trusted copy with <strong> */ ?></p>
      <?php endforeach; ?>

      <ul class="check-list" data-reveal data-reveal-delay="4">
        <?php foreach (HOME_OPPORTUNITY['checks'] as $check): ?>
          <li><span class="check-dot"><?= icon('check') ?></span><?= e($check) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="split-visual" data-reveal data-reveal-delay="2">
      <div class="visual-frame">
        <div class="visual-canvas"
             data-cluster-canvas
             data-nodes="<?= e(json_encode(HOME_OPPORTUNITY_NODES, JSON_THROW_ON_ERROR)) ?>"
             role="img"
             aria-label="Demand clusters feeding India-wide logistics infrastructure: manufacturing, e-commerce, cross-border trade, and agri and cold chain."></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--light">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => HOME_SERVICES['eyebrow'],
        'title'   => HOME_SERVICES['title'],
        'lead'    => HOME_SERVICES['lead'],
    ]); ?>

    <div class="grid grid-3">
      <?php foreach (SOLUTIONS as $i => $item): ?>
        <?php component('feature-card', ['item' => $item, 'index' => $i]); ?>
      <?php endforeach; ?>
    </div>

    <div class="section-foot" data-reveal>
      <a class="btn btn-outline" href="<?= e(url('solutions.php')) ?>">Explore All Solutions</a>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => HOME_WHY['eyebrow'],
        'title'   => HOME_WHY['title'],
    ]); ?>

    <div class="grid grid-4">
      <?php foreach (HOME_WHY['items'] as $i => $item): ?>
        <?php component('feature-card', ['item' => $item, 'index' => $i]); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--navy globe-section">
  <div class="shell split">
    <div class="split-copy">
      <p class="eyebrow eyebrow--gold" data-reveal><?= e(HOME_NETWORK['eyebrow']) ?></p>
      <h2 class="section-title section-title--left section-title--invert" data-reveal data-reveal-delay="1"><?= e(HOME_NETWORK['title']) ?></h2>
      <p class="prose prose--invert" data-reveal data-reveal-delay="2"><?= e(HOME_NETWORK['body']) ?></p>
      <div data-reveal data-reveal-delay="3">
        <a class="btn btn-gold" href="<?= e(url(HOME_NETWORK['cta']['href'])) ?>"><?= e(HOME_NETWORK['cta']['label']) ?></a>
      </div>
    </div>

    <div class="split-visual" data-reveal data-reveal-delay="2">
      <div class="visual-frame visual-frame--dark">
        <div class="visual-canvas"
             data-globe-canvas
             role="img"
             aria-label="An interactive globe showing LogiSetu's multimodal freight network: air cargo, sea freight, rail and road corridors linking India, Dubai and London."></div>
      </div>
    </div>
  </div>
</section>

<?php
component('film', ['film' => HOME_FILM]);

component('cta', ['cta' => HOME_CTA, 'tone' => 'light']);

require __DIR__ . '/includes/footer.php';
