<?php
/**
 * Centred eyebrow + title (+ optional lead) used above most grids.
 *
 * @var string      $eyebrow
 * @var string      $title
 * @var string|null $lead
 * @var string      $align  'center' (default) or 'left'
 */

declare(strict_types=1);

$align = $align ?? 'center';
$lead  = $lead  ?? null;
?>
<header class="section-head section-head--<?= e($align) ?>">
  <?php if (!empty($eyebrow)): ?>
    <p class="eyebrow" data-reveal><?= e($eyebrow) ?></p>
  <?php endif; ?>
  <h2 class="section-title" data-reveal data-reveal-delay="1"><?= e($title) ?></h2>
  <?php if ($lead): ?>
    <p class="section-lead" data-reveal data-reveal-delay="2"><?= e($lead) ?></p>
  <?php endif; ?>
</header>
