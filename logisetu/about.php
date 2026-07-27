<?php
declare(strict_types=1);

$page      = 'about';
$pageTitle = 'About — LogiSetu';
$pageDesc  = 'LogiSetu is a logistics infrastructure company built to close the gap between India’s economic ambition and the infrastructure needed to move goods efficiently.';
$sceneMode = 'grid';

require __DIR__ . '/includes/header.php';

component('hero', ['hero' => ABOUT_HERO, 'variant' => 'page']);
?>

<section class="section section--white">
  <div class="shell split">
    <div class="split-copy">
      <p class="eyebrow" data-reveal><?= e(ABOUT_MISSION['eyebrow']) ?></p>
      <h2 class="section-title section-title--left" data-reveal data-reveal-delay="1"><?= e(ABOUT_MISSION['title']) ?></h2>
      <?php foreach (ABOUT_MISSION['body'] as $i => $para): ?>
        <p class="prose" data-reveal data-reveal-delay="<?= $i + 2 ?>"><?= e($para) ?></p>
      <?php endforeach; ?>
    </div>

    <div class="split-visual" data-reveal data-reveal-delay="2">
      <div class="visual-frame">
        <div class="visual-canvas"
             data-phases-canvas
             data-phases="<?= e(json_encode(ABOUT_PHASES, JSON_THROW_ON_ERROR)) ?>"
             role="img"
             aria-label="Phased logistics capacity build-out from Phase 1 through to scale, with 2026 marked as today."></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--light">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => ABOUT_APPROACH['eyebrow'],
        'title'   => ABOUT_APPROACH['title'],
    ]); ?>

    <ol class="step-grid">
      <?php foreach (ABOUT_APPROACH['items'] as $i => $step): ?>
        <li class="step" data-reveal data-reveal-delay="<?= (int) $i ?>">
          <span class="step-no"><?= e($step['no']) ?></span>
          <div>
            <h3 class="step-title"><?= e($step['title']) ?></h3>
            <p class="step-body"><?= e($step['body']) ?></p>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section class="section section--white">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => ABOUT_TEAM['eyebrow'],
        'title'   => ABOUT_TEAM['title'],
        'lead'    => ABOUT_TEAM['lead'],
    ]); ?>
  </div>
</section>

<section class="section section--light">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => ABOUT_OPERATE['eyebrow'],
        'title'   => ABOUT_OPERATE['title'],
    ]); ?>

    <div class="grid grid-3">
      <?php foreach (ABOUT_OPERATE['items'] as $i => $item): ?>
        <?php component('feature-card', ['item' => $item, 'index' => $i]); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php';
