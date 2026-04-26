<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="brand-name">{{ $t('siteName') }}</span>
          <p class="brand-tagline">{{ $t('footer.tagline') }}</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>{{ $t('nav.products') }}</h4>
            <NuxtLink :to="getLocalePath('/baby-feeding-bottles')">
              {{ $t('nav.feedingBottles') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-sippy-cups')">
              {{ $t('nav.sippyCups') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-tableware')">
              {{ $t('nav.tableware') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-bath-potty')">
              {{ $t('nav.bathPotty') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-milk-powder-container')">
              {{ $t('nav.milkPowderBox') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/other-accessory')">
              {{ $t('nav.accessories') }}
            </NuxtLink>
          </div>
          <div class="link-group">
            <h4>{{ $t('footer.company') }}</h4>
            <NuxtLink :to="getLocalePath('/about-us')">
              {{ $t('nav.about') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/contact-us')">
              {{ $t('nav.contact') }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ $t('siteName') }}. {{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useI18n()

const currentYear = new Date().getFullYear()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.footer {
  background: #070707;
  color: @card-background;
  margin-top: auto;
}

.footer-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: @spacing-xl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-lg @spacing-sm;
  }
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.footer-brand {
  .brand-name {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
    margin-bottom: @spacing-xs;
  }

  .brand-tagline {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 0;
  }
}

.footer-links {
  display: flex;
  gap: @spacing-xl;
  justify-content: flex-end;

  @media (max-width: @breakpoint-tablet) {
    justify-content: flex-start;
    gap: @spacing-lg;
  }
}

.link-group {
  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: @spacing-sm;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  a {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.875rem;
    margin-bottom: @spacing-xs;
    transition: color @transition-fast;

    &:hover {
      color: @card-background;
    }
  }
}

.footer-bottom {
  margin-top: @spacing-xl;
  padding-top: @spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    text-align: center;
  }
}
</style>