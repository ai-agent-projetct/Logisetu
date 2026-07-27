<?php
/**
 * White card with an icon tile — used by the services, why-us and footprint grids.
 *
 * @var array $item   icon / title / body (+ optional tags, long_title)
 * @var int   $index  Stagger index for the reveal animation.
 * @var bool  $long   Use the longer body copy variant on the Solutions page.
 */

declare(strict_types=1);

$index = $index ?? 0;
$long  = $long  ?? false;
$title = $long && !empty($item['long_title']) ? $item['long_title'] : $item['title'];
$body  = $long && !empty($item['long']) ? $item['long'] : ($item['short'] ?? $item['body'] ?? '');
?>
<article class="card" data-tilt data-reveal data-reveal-delay="<?= (int) $index ?>">
  <?php if (!empty($item['icon'])): ?>
    <span class="card-icon"><?= icon($item['icon']) ?></span>
  <?php endif; ?>
  <h3 class="card-title"><?= e($title) ?></h3>
  <p class="card-body"><?= e($body) ?></p>

  <?php if (!empty($item['tags'])): ?>
    <ul class="tag-row">
      <?php foreach ($item['tags'] as $tag): ?>
        <li class="tag"><?= e($tag) ?></li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</article>
