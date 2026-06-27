<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <NuxtLink :to="getLocalePath('/')" class="logo">
            <span class="logo-text">{{ $t('siteName') }}</span>
          </NuxtLink>
          <p class="footer-desc">{{ $t('footer.tagline') }}</p>
          <ul v-if="contactLinks.length" class="footer-contact">
            <li v-for="link in contactLinks" :key="`${link.iconKey}-${link.url}`">
              <SocialIcon
                :icon-key="link.iconKey"
                :icon-source="link.iconSource"
                :icon-url="link.iconUrl"
                variant="contact"
                class="contact-icon"
              />
              <a :href="link.url">{{ getLinkDisplayText(link) }}</a>
              <span v-if="link.label" class="contact-tag">{{ link.label }}</span>
            </li>
          </ul>
          <div v-if="socialLinks.length" class="social-links">
            <a
              v-for="link in socialLinks"
              :key="`${link.iconKey}-${link.url}`"
              :href="link.url"
              class="social-link"
              :aria-label="getLinkAriaLabel(link)"
              :target="link.openInNewTab ? '_blank' : undefined"
              :rel="link.openInNewTab ? 'noopener noreferrer' : undefined"
            >
              <SocialIcon
                :icon-key="link.iconKey"
                :icon-source="link.iconSource"
                :icon-url="link.iconUrl"
                variant="social"
              />
            </a>
          </div>
        </div>

        <!-- Products -->
        <div class="footer-column">
          <h4 class="footer-title">{{ $t('nav.products') }}</h4>
          <ul class="footer-links">
            <li>
              <NuxtLink :to="getLocalePath('/baby-feeding-bottles')">
                {{ $t('nav.feedingBottles') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/baby-sippy-cups')">
                {{ $t('nav.sippyCups') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/baby-tableware')">
                {{ $t('nav.tableware') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/baby-bath-potty')">
                {{ $t('nav.bathPotty') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/baby-milk-powder-container')">
                {{ $t('nav.milkPowderBox') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/other-accessory')">
                {{ $t('nav.accessories') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div class="footer-column">
          <h4 class="footer-title">{{ $t('footer.company') }}</h4>
          <ul class="footer-links">
            <li>
              <NuxtLink :to="getLocalePath('/')">{{ $t('nav.home') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/about-us')">{{ $t('nav.about') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalePath('/contact-us')">{{ $t('nav.contact') }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Find Us -->
        <div v-if="displayAddress || mapEmbedUrl" class="footer-column footer-findus">
          <h4 class="footer-title">{{ $t('footer.findUs') }}</h4>
          <p v-if="displayAddress" class="footer-address pre-line">{{ displayAddress }}</p>
          <div v-if="mapEmbedUrl" class="map-wrapper">
            <iframe
              :src="mapEmbedUrl"
              width="100%"
              height="200"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="$t('footer.findUs')"
            />
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ $t('siteName') }}. {{ $t('footer.copyright') }}</p>
        <div class="footer-bottom-links">
          <a href="#">{{ $t('footer.privacyPolicy') }}</a>
          <a href="#">{{ $t('footer.termsOfService') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { $t, getLocalePath, locale } = useI18n()
const {
  contactLinks,
  socialLinks,
  contactProfile,
  getLinkDisplayText,
  getLinkAriaLabel,
  getLocalizedProfileText,
  getMapEmbedQuery,
  buildGoogleMapEmbedUrl,
} = useContactLinks()

const currentYear = new Date().getFullYear()

const displayAddress = computed(() =>
  getLocalizedProfileText(contactProfile.value, 'address', locale.value),
)

const mapEmbedUrl = computed(() =>
  buildGoogleMapEmbedUrl(getMapEmbedQuery(contactProfile.value), locale.value),
)
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.site-footer {
  background: #070707;
  color: @card-background;
  padding: @spacing-xxl 0 @spacing-lg;
  margin-top: auto;
}

.footer-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-sm;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr 2fr;
  gap: @spacing-xl;
  margin-bottom: @spacing-xl;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-lg;
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.footer-brand {
  .logo {
    display: inline-block;
    text-decoration: none;
    margin-bottom: @spacing-sm;

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: @card-background;
      letter-spacing: 0.02em;
      transition: color @transition-fast;

      &:hover {
        color: @primary-color;
      }
    }
  }

  .footer-desc {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.875rem;
    line-height: 1.7;
    margin: 0 0 @spacing-md;
    max-width: 280px;
  }
}

.footer-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 @spacing-md;
  color: @card-background;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: @spacing-xs;
  }

  a {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color @transition-fast;

    &:hover {
      color: @primary-color;
    }
  }
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0 0 @spacing-md;
  display: flex;
  flex-direction: column;
  gap: 14px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.875rem;
    line-height: 1.5;

    :deep(.social-icon--contact svg),
    :deep(.uploaded-icon),
    .contact-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: @primary-color;
    }

    :deep(.brand-icon--wide) {
      width: calc(16px * 1.4);
      height: 16px;
    }

    a {
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      transition: color @transition-fast;
      word-break: break-all;

      &:hover {
        color: @primary-color;
      }
    }

    .contact-tag {
      display: inline-block;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      color: @card-background;
      background: @primary-color;
      border-radius: @radius-full;
      white-space: nowrap;
    }
  }
}

.social-links {
  display: flex;
  gap: 12px;

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: background @transition-normal, color @transition-normal, transform @transition-normal;
    overflow: hidden;

    &:hover {
      background: @primary-color;
      color: @card-background;
      transform: translateY(-2px);
    }

    :deep(.social-icon--social svg),
    :deep(.uploaded-icon) {
      width: 18px;
      height: 18px;
    }

    :deep(.brand-icon--wide) {
      width: calc(18px * 1.4);
      height: 18px;
    }
  }
}

.footer-findus {
  .footer-address {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0 0 @spacing-sm;
  }

  .map-wrapper {
    border-radius: @radius-md;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);

    iframe {
      display: block;
    }
  }
}

.pre-line {
  white-space: pre-line;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: @spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);

  p {
    margin: 0;
  }

  .footer-bottom-links {
    display: flex;
    gap: @spacing-md;

    a {
      color: rgba(255, 255, 255, 0.45);
      text-decoration: none;
      transition: color @transition-fast;

      &:hover {
        color: @primary-color;
      }
    }
  }

  @media (max-width: @breakpoint-mobile) {
    flex-direction: column;
    gap: @spacing-sm;
    text-align: center;
  }
}
</style>
