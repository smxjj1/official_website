<script setup lang="ts">
definePageMeta({
  layout: 'empty',
});
const router = useRouter();

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back();
    return;
  }
  router.push('/');
}

useHead({
  title: 'Page not found',
});
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="visual">
      <div class="visual-card">
        <svg
          class="illustration"
          viewBox="0 0 360 240"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="not-found-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#ffb3ba" />
              <stop offset="100%" stop-color="#F23640" />
            </linearGradient>
            <linearGradient id="not-found-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#ffd9dc" stop-opacity="0.5" />
            </linearGradient>
          </defs>

          <rect
            x="30"
            y="40"
            width="300"
            height="160"
            rx="28"
            fill="url(#not-found-gradient)"
            opacity="0.85"
          />
          <rect
            x="50"
            y="58"
            width="260"
            height="124"
            rx="22"
            fill="url(#not-found-highlight)"
          />
          <circle cx="80" cy="84" r="6" fill="#F23640" opacity="0.5" />
          <circle cx="100" cy="84" r="6" fill="#F23640" opacity="0.5" />
          <circle cx="120" cy="84" r="6" fill="#F23640" opacity="0.5" />
          <path
            d="M86 186c12-18 28-30 48-30s36 12 48 30"
            fill="none"
            stroke="#F23640"
            stroke-width="4"
            stroke-linecap="round"
            opacity="0.4"
          />
          <path
            d="M210 186c10-14 24-24 40-24s30 10 40 24"
            fill="none"
            stroke="#F23640"
            stroke-width="4"
            stroke-linecap="round"
            opacity="0.3"
          />
          <text
            x="50%"
            y="140"
            text-anchor="middle"
            font-size="96"
            font-weight="700"
            fill="#F23640"
          >
            404
          </text>
        </svg>
      </div>
    </div>

    <div class="content">
      <p class="eyebrow">
        Oops !
      </p>
      <h1 id="not-found-title">
        Page not found
      </h1>
      <p class="description">
        The page you are looking for does not exist or some other error occurred,go back to home page.
      </p>
      <div class="actions" role="group" aria-label="page back action">
        <NuxtLink to="/public" class="action action-primary">
          Go Home
        </NuxtLink>
        <button type="button" class="action action-outline" @click="goBack">
          Go Back
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 6vw, 4rem);
  align-items: center;
  padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 4rem);
  background-color: #ffffff;
}

.visual {
  display: flex;
  justify-content: center;
}

.visual-card {
  position: relative;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 26px;
  background: linear-gradient(145deg, #ffffff, #ffecef);
  box-shadow: 0 32px 60px -40px rgba(242, 54, 64, 0.7),
    0 18px 30px -30px rgba(23, 26, 36, 0.35);
  overflow: hidden;
}

.visual-card::after {
  content: '';
  position: absolute;
  inset: 14% 16%;
  border-radius: 20px;
  border: 1px dashed rgba(242, 54, 64, 0.2);
  pointer-events: none;
}

.illustration {
  width: min(100%, 360px);
  height: auto;
  display: block;
}

.content {
  max-width: 480px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 1.25rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background-color: rgba(242, 54, 64, 0.1);
  color: #F23640;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1 {
  margin-bottom: 1rem;
  font-size: clamp(2.1rem, 4vw, 2.8rem);
  line-height: 1.15;
  color: #171a24;
}

.description {
  margin-bottom: 2.5rem;
  font-size: clamp(1rem, 1.6vw, 1.1rem);
  line-height: 1.7;
  color: #4b5563;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
  transition: transform 180ms ease, box-shadow 200ms ease, background-color 200ms ease,
    color 200ms ease, border-color 200ms ease;
  cursor: pointer;
}

.action-primary {
  background-color: #F23640;
  color: #ffffff;
  box-shadow: 0 14px 28px -18px rgba(242, 54, 64, 0.8);
}

.action-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 40px -24px rgba(242, 54, 64, 0.9);
}

.action-outline {
  background-color: #ffffff;
  color: #F23640;
  border-color: rgba(242, 54, 64, 0.7);
}

.action-outline:hover {
  background-color: rgba(242, 54, 64, 0.08);
}

.action:focus-visible {
  outline: 3px solid rgba(242, 54, 64, 0.3);
  outline-offset: 4px;
}

@media (max-width: 960px) {
  .not-found {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .visual {
    order: -1;
  }

  .visual-card::after {
    inset: 16% 12%;
  }

  .content {
    max-width: 520px;
  }

  .actions {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .not-found {
    min-height: 100vh;
    padding: clamp(3rem, 12vw, 4rem) clamp(1.25rem, 6vw, 2rem) 3rem;
  }

  .visual-card {
    border-radius: 22px;
  }

  .eyebrow {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
  }

  .actions {
    flex-direction: column;
  }

  .action {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .action {
    transition: none;
  }

  .action-primary:hover,
  .action-primary:focus-visible {
    transform: none;
    box-shadow: 0 14px 28px -18px rgba(242, 54, 64, 0.8);
  }
}
</style>
