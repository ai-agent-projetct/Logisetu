<?php
/**
 * @var string      $page       Current nav slug.
 * @var string      $pageTitle  <title> text.
 * @var string      $pageDesc   Meta description.
 * @var string|null $sceneMode  3D hero scene preset: yard | corridor | terminal | grid | orbit.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$page      = $page      ?? 'home';
$pageTitle = $pageTitle ?? SITE_NAME;
$pageDesc  = $pageDesc  ?? SITE_TAGLINE;
$sceneMode = $sceneMode ?? 'yard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="<?= e($pageDesc) ?>">
<meta name="theme-color" content="#0A1A33">
<meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
<meta property="og:title" content="<?= e($pageTitle) ?>">
<meta property="og:description" content="<?= e($pageDesc) ?>">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="<?= e(asset('assets/img/favicon.png')) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= e(asset('assets/css/style.css')) ?>">
<script type="importmap">
{ "imports": { "three": "<?= e(asset('assets/vendor/three/three.module.js')) ?>" } }
</script>
</head>
<body class="page-<?= e($page) ?>" data-scene="<?= e($sceneMode) ?>">

<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header" id="siteHeader">
  <div class="shell header-inner">
    <a class="brand" href="<?= e(url('index.php')) ?>" aria-label="<?= e(SITE_NAME) ?> home">
      <img class="brand-logo" src="<?= e(asset('assets/img/logo-full.png')) ?>"
           width="1109" height="420" alt="<?= e(SITE_NAME) ?> — Bridging distances, delivering possibilities">
    </a>

    <nav class="site-nav" id="siteNav" aria-label="Primary">
      <?php foreach (NAV_ITEMS as $slug => $item): ?>
        <a class="nav-link<?= $page === $slug ? ' is-active' : '' ?>"
           href="<?= e(url($item['href'])) ?>"
           <?= $page === $slug ? 'aria-current="page"' : '' ?>><?= e($item['label']) ?></a>
      <?php endforeach; ?>
      <a class="btn btn-gold nav-cta" href="<?= e(url('contact.php')) ?>">Get in Touch</a>
    </nav>

    <button class="nav-toggle" id="navToggle" type="button"
            aria-controls="siteNav" aria-expanded="false" aria-label="Open menu">
      <?= icon('menu', 'icon nav-toggle-open') ?>
      <?= icon('close', 'icon nav-toggle-close') ?>
    </button>
  </div>
</header>

<main id="main">
