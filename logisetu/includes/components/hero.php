<?php
/**
 * Dark hero with the WebGL logistics scene behind it.
 *
 * @var array  $hero     eyebrow / title / lead (+ optional pills, primary, ghost)
 * @var string $variant  'lead' for the taller home hero, 'page' for inner pages.
 * @var array  $cards    Optional glass cards docked to the bottom of the hero.
 */

declare(strict_types=1);

$variant = $variant ?? 'page';
$cards   = $cards   ?? [];

/*
 * Cinematic backdrop. When the rendered hero film is present it plays as the
 * background with the still as its poster; otherwise the WebGL scene runs.
 * The poster alone covers reduced-motion and any browser that won't autoplay.
 */
$heroVideo  = is_file(ROOT_PATH . '/assets/video/hero.mp4');
$heroPoster = is_file(ROOT_PATH . '/assets/video/hero-poster.jpg');
?>
<section class="hero hero--<?= e($variant) ?><?= $heroVideo ? ' hero--film' : '' ?>">
  <?php if ($heroVideo): ?>
    <div class="hero-film" aria-hidden="true">
      <video autoplay muted loop playsinline preload="metadata" disablepictureinpicture
             <?= $heroPoster ? 'poster="' . e(asset('assets/video/hero-poster.jpg')) . '"' : '' ?>>
        <?php if (is_file(ROOT_PATH . '/assets/video/hero-mobile.mp4')): ?>
          <source src="<?= e(asset('assets/video/hero-mobile.mp4')) ?>" type="video/mp4" media="(max-width: 860px)">
        <?php endif; ?>
        <source src="<?= e(asset('assets/video/hero.mp4')) ?>" type="video/mp4">
      </video>
    </div>
  <?php else: ?>
    <div class="hero-canvas" data-hero-canvas aria-hidden="true"></div>
  <?php endif; ?>
  <div class="hero-veil" aria-hidden="true"></div>

  <div class="shell hero-inner">
    <div class="hero-copy">
      <?php if (!empty($hero['eyebrow'])): ?>
        <span class="eyebrow-pill" data-reveal><?= e($hero['eyebrow']) ?></span>
      <?php endif; ?>

      <h1 class="hero-title" data-reveal data-reveal-delay="1"><?= e($hero['title']) ?></h1>

      <?php if (!empty($hero['lead'])): ?>
        <p class="hero-lead" data-reveal data-reveal-delay="2"><?= e($hero['lead']) ?></p>
      <?php endif; ?>

      <?php if (!empty($hero['pills'])): ?>
        <ul class="hero-pills" data-reveal data-reveal-delay="3">
          <?php foreach ($hero['pills'] as $pill): ?>
            <li><?= e($pill) ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>

      <?php if (!empty($hero['primary']) || !empty($hero['ghost'])): ?>
        <div class="hero-actions" data-reveal data-reveal-delay="4">
          <?php if (!empty($hero['primary'])): ?>
            <a class="btn btn-gold btn-lg" href="<?= e(url($hero['primary']['href'])) ?>"><?= e($hero['primary']['label']) ?></a>
          <?php endif; ?>
          <?php if (!empty($hero['ghost'])): ?>
            <a class="btn btn-ghost btn-lg" href="<?= e(url($hero['ghost']['href'])) ?>"><?= e($hero['ghost']['label']) ?></a>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    </div>

    <?php if ($cards): ?>
      <div class="hero-cards">
        <?php foreach ($cards as $i => $card): ?>
          <article class="glass-card" data-tilt data-reveal data-reveal-delay="<?= (int) ($i + 5) ?>">
            <h2><?= e($card['title']) ?></h2>
            <p><?= e($card['body']) ?></p>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

  <?php if ($variant === 'lead'): ?>
    <div class="hero-scroll" aria-hidden="true"><span></span>Scroll</div>
  <?php endif; ?>
</section>
