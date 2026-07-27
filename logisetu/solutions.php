<?php
declare(strict_types=1);

$page      = 'solutions';
$pageTitle = 'Solutions — LogiSetu';
$pageDesc  = 'From land to lease, LogiSetu designs, builds and operates the infrastructure that modern Indian supply chains depend on.';
$sceneMode = 'terminal';

require __DIR__ . '/includes/header.php';

component('hero', ['hero' => SOLUTIONS_HERO, 'variant' => 'page']);
?>

<section class="section section--white">
  <div class="shell">
    <div class="grid grid-2">
      <?php foreach (SOLUTIONS as $i => $item): ?>
        <?php component('feature-card', ['item' => $item, 'index' => $i, 'long' => true]); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--light">
  <div class="shell">
    <?php component('section-head', [
        'eyebrow' => SOLUTIONS_AUDIENCE['eyebrow'],
        'title'   => SOLUTIONS_AUDIENCE['title'],
    ]); ?>

    <div class="grid grid-4">
      <?php foreach (SOLUTIONS_AUDIENCE['items'] as $i => $item): ?>
        <article class="card card--plain" data-tilt data-reveal data-reveal-delay="<?= (int) $i ?>">
          <h3 class="card-title"><?= e($item['title']) ?></h3>
          <p class="card-body"><?= e($item['body']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php
component('cta', ['cta' => SOLUTIONS_CTA, 'tone' => 'light']);

require __DIR__ . '/includes/footer.php';
