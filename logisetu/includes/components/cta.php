<?php
/**
 * Full-width closing call to action.
 *
 * @var array  $cta    eyebrow / title / lead / cta[label,href]
 * @var string $tone   'light' (white bg) or 'dark' (navy bg).
 */

declare(strict_types=1);

$tone = $tone ?? 'light';
?>
<section class="cta-band cta-band--<?= e($tone) ?>">
  <div class="shell cta-inner">
    <?php if (!empty($cta['eyebrow'])): ?>
      <p class="eyebrow" data-reveal><?= e($cta['eyebrow']) ?></p>
    <?php endif; ?>
    <h2 class="cta-title" data-reveal data-reveal-delay="1"><?= e($cta['title']) ?></h2>
    <?php if (!empty($cta['lead'])): ?>
      <p class="cta-lead" data-reveal data-reveal-delay="2"><?= e($cta['lead']) ?></p>
    <?php endif; ?>
    <div data-reveal data-reveal-delay="3">
      <a class="btn btn-gold btn-lg" href="<?= e(url($cta['cta']['href'])) ?>"><?= e($cta['cta']['label']) ?></a>
    </div>
  </div>
</section>
