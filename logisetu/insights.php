<?php
declare(strict_types=1);

$page      = 'insights';
$pageTitle = 'Insights — LogiSetu';
$pageDesc  = 'Views from the LogiSetu team on what it takes to modernise Indian logistics.';
$sceneMode = 'corridor';

require __DIR__ . '/includes/header.php';

component('hero', ['hero' => INSIGHTS_HERO, 'variant' => 'page']);
?>

<section class="section section--white">
  <div class="shell">
    <div class="article-list">
      <?php foreach (INSIGHTS_ARTICLES as $i => $article): ?>
        <article class="article" data-reveal data-reveal-delay="<?= (int) $i ?>">
          <p class="article-meta">
            <span class="article-kicker"><?= e($article['kicker']) ?></span>
            <span><?= e($article['year']) ?></span>
            <span><?= e($article['read']) ?></span>
          </p>
          <h2 class="article-title"><?= e($article['title']) ?></h2>
          <?php foreach ($article['body'] as $para): ?>
            <p class="prose"><?= e($para) ?></p>
          <?php endforeach; ?>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php';
