<?php
/**
 * Full-bleed cinematic film band with chapter markers.
 *
 * The film runs road → rail → sea → air → hub, three seconds each. The chapter
 * buttons seek straight to a segment, so the section works as a navigable
 * capability overview rather than a video you have to sit through.
 *
 * @var array $film  eyebrow / title / lead / chapters[label, at, note]
 */

declare(strict_types=1);

$src    = ROOT_PATH . '/assets/video/network-film.mp4';
$poster = ROOT_PATH . '/assets/video/network-film-poster.jpg';

if (!is_file($src)) {
    return;
}
?>
<section class="film-band">
  <div class="shell">
    <header class="section-head section-head--center">
      <p class="eyebrow eyebrow--gold" data-reveal><?= e($film['eyebrow']) ?></p>
      <h2 class="section-title section-title--invert" data-reveal data-reveal-delay="1"><?= e($film['title']) ?></h2>
      <?php if (!empty($film['lead'])): ?>
        <p class="section-lead section-lead--invert" data-reveal data-reveal-delay="2"><?= e($film['lead']) ?></p>
      <?php endif; ?>
    </header>
  </div>

  <div class="shell film-shell" data-reveal data-reveal-delay="2">
    <figure class="film-frame">
      <video class="film-video"
             data-film
             muted loop playsinline preload="metadata"
             <?= is_file($poster) ? 'poster="' . e(asset('assets/video/network-film-poster.jpg')) . '"' : '' ?>>
        <?php if (is_file(ROOT_PATH . '/assets/video/network-film-mobile.mp4')): ?>
          <source src="<?= e(asset('assets/video/network-film-mobile.mp4')) ?>" type="video/mp4" media="(max-width: 860px)">
        <?php endif; ?>
        <source src="<?= e(asset('assets/video/network-film.mp4')) ?>" type="video/mp4">
      </video>

      <button class="film-play" type="button" data-film-toggle aria-label="Play the network film">
        <span class="film-play-icon" aria-hidden="true"></span>
      </button>

      <figcaption class="sr-only">
        LogiSetu's multimodal network: road, rail, sea and air freight converging on an integrated logistics hub.
      </figcaption>
    </figure>

    <ol class="film-chapters" role="list">
      <?php foreach ($film['chapters'] as $i => $chapter): ?>
        <li>
          <button type="button"
                  class="film-chapter<?= $i === 0 ? ' is-active' : '' ?>"
                  data-film-seek="<?= (int) $chapter['at'] ?>">
            <span class="film-chapter-index"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
            <span class="film-chapter-label"><?= e($chapter['label']) ?></span>
            <span class="film-chapter-note"><?= e($chapter['note']) ?></span>
          </button>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
