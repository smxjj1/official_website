<template>
  <header class="header">
    <!-- Top contact bar -->
    <div v-if="contactLinks.length || socialLinks.length" class="top-info-bar">
      <div class="top-info-inner">
        <div v-if="contactLinks.length" class="contact-info">
          <a
            v-for="link in contactLinks"
            :key="`${link.iconKey}-${link.url}`"
            :href="link.url"
            class="info-item"
            :aria-label="getContactLinkAriaLabel(link)"
          >
            <SocialIcon
              :icon-key="link.iconKey"
              :icon-source="link.iconSource"
              :icon-url="link.iconUrl"
              variant="contact"
            />
            <span aria-hidden="true">{{ getLinkDisplayText(link) }}</span>
          </a>
        </div>
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
    </div>

    <!-- Main navbar -->
    <div class="header-main" :class="{ 'header-main--shadow': showNavShadow }">
      <div class="header-container">
        <NuxtLink :to="getLocalePath('/')" class="logo" @click="closeMenu">
          <span class="logo-text">{{ $t('siteName') }}</span>
        </NuxtLink>

        <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
          <NuxtLink
            :to="getLocalePath('/')"
            class="nav-link"
            :class="{ active: isHomePage }"
            @click="closeMenu"
          >
            {{ $t('nav.home') }}
          </NuxtLink>

          <div class="nav-dropdown">
            <button
              type="button"
              class="nav-link nav-dropdown-trigger"
              :class="{ active: isProductPage }"
              :aria-expanded="showProductsMenu"
              @click="toggleProductsMenu"
              @mouseenter="openProductsMenu"
              @mouseleave="closeProductsMenuDelayed"
            >
              {{ $t('nav.products') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              class="nav-dropdown-menu"
              :class="{ 'dropdown-open': showProductsMenu }"
              @mouseenter="cancelProductsMenuClose"
              @mouseleave="closeProductsMenuDelayed"
            >
              <NuxtLink
                v-for="item in productLinks"
                :key="item.slug"
                :to="getLocalePath(item.path)"
                class="dropdown-link"
                :class="{ active: isCurrentProduct(item.path) }"
                @click="closeMenu"
              >
                {{ item.label }}
              </NuxtLink>
              <span v-if="!navPending && productLinks.length === 0" class="dropdown-empty">
                —
              </span>
            </div>
          </div>

          <NuxtLink
            :to="getLocalePath('/about-us')"
            class="nav-link"
            :class="{ active: isActive('/about-us') }"
            @click="closeMenu"
          >
            {{ $t('nav.about') }}
          </NuxtLink>
          <NuxtLink
            :to="getLocalePath('/news')"
            class="nav-link"
            :class="{ active: isActive('/news') }"
            @click="closeMenu"
          >
            {{ $t('nav.news') }}
          </NuxtLink>
          <NuxtLink
            :to="getLocalePath('/contact-us')"
            class="nav-link nav-link-contact"
            :class="{ active: isActive('/contact-us') }"
            @click="closeMenu"
          >
            {{ $t('nav.contact') }}
          </NuxtLink>
        </nav>

        <LanguageSwitcher />
        <button
          class="menu-toggle"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <span class="menu-icon" :class="{ 'menu-icon-open': isMenuOpen }" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { $t, getLocalePath } = useSiteLocale()
const { contactLinks, socialLinks, getLinkDisplayText, getLinkAriaLabel, getContactLinkAriaLabel } = useContactLinks()
const { navItems: productLinks, pending: navPending } = useProductCategoryNav()

const isMenuOpen = ref(false)
const showProductsMenu = ref(false)
const isScrolled = ref(false)
let productsMenuTimer: ReturnType<typeof setTimeout> | null = null

const isHomePage = computed(() => {
  const p = route.path.replace(/\/$/, '') || '/'
  return p === '/' || p === '/zh-CN' || p === '/zh-TW'
})

const showNavShadow = computed(() => isScrolled.value || !isHomePage.value)

const stripLocale = (path: string) => {
  if (path.startsWith('/zh-CN')) return path.replace('/zh-CN', '') || '/'
  if (path.startsWith('/zh-TW')) return path.replace('/zh-TW', '') || '/'
  return path
}

const isActive = (path: string) => {
  const strippedPath = stripLocale(route.path)
  return strippedPath === path || strippedPath.startsWith(`${path}/`)
}

const isProductPage = computed(() =>
  productLinks.value.some(item => isActive(item.path)),
)

const isCurrentProduct = (path: string) => isActive(path)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) {
    showProductsMenu.value = false
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  showProductsMenu.value = false
}

const toggleProductsMenu = () => {
  if (window.innerWidth <= 992) {
    showProductsMenu.value = !showProductsMenu.value
  }
}

const openProductsMenu = () => {
  if (window.innerWidth > 992) {
    if (productsMenuTimer) clearTimeout(productsMenuTimer)
    showProductsMenu.value = true
  }
}

const closeProductsMenuDelayed = () => {
  if (window.innerWidth > 992) {
    productsMenuTimer = setTimeout(() => {
      showProductsMenu.value = false
    }, 120)
  }
}

const cancelProductsMenuClose = () => {
  if (productsMenuTimer) clearTimeout(productsMenuTimer)
}

watch(() => route.path, closeMenu)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (productsMenuTimer) clearTimeout(productsMenuTimer)
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.top-info-bar {
  background: @section-background;
  border-bottom: 1px solid @border-light;
  font-size: 0.75rem;
}

.top-info-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 6px @spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: @spacing-lg;
  flex-wrap: wrap;

  @media (max-width: @breakpoint-mobile) {
    gap: @spacing-sm;
  }
}

.info-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: @text-light-accessible;
  text-decoration: none;
  transition: color @transition-fast;
  min-height: 44px;
  min-width: 44px;

  @media (min-width: (@breakpoint-mobile + 1)) {
    min-width: 0;
  }

  svg,
  :deep(.social-icon--contact svg) {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: @primary-color;
  }

  span {
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: @breakpoint-tablet) {
      max-width: 120px;
      font-size: 11px;
    }

    @media (max-width: @breakpoint-mobile) {
      display: none;
    }
  }

  &:hover {
    color: @primary-color;
  }
}

.social-links {
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: @breakpoint-mobile) {
    display: none;
  }
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: @text-light;
  text-decoration: none;
  transition: color @transition-fast;

  &:hover {
    color: @primary-color;
  }

  :deep(.social-icon--social svg) {
    width: 14px;
    height: 14px;
  }

  :deep(.xiaohongshu-icon) {
    width: calc(14px * 1.4);
    height: 14px;
  }
}

.header-main {
  background: @card-background;
  border-bottom: 1px solid @border-color;
  transition: box-shadow @transition-normal;

  &.header-main--shadow {
    box-shadow: 0 2px 12px rgba(74, 64, 58, 0.06);
  }
}

.header-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-md;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-sm;
  }
}

.logo {
  text-decoration: none;
  color: @primary-color-dark;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.125rem;
  }

  @media (max-width: @breakpoint-mobile) {
    font-size: 1rem;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: @spacing-lg;

  @media (max-width: 992px) {
    position: fixed;
    top: calc(36px + 60px);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    margin: 0;
    padding: @spacing-md;
    background: @card-background;
    border-bottom: 1px solid @border-color;
    transform: translateY(-8px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: @transition-normal;
    z-index: 999;

    &.nav-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
  }
}

.nav-link {
  color: @text-light;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: @spacing-xs 0;
  transition: color @transition-fast;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: @primary-color;
  }

  &.active {
    color: @primary-color;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: @primary-color;
      border-radius: 1px;
    }
  }

  &.nav-dropdown-trigger {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    svg {
      transition: transform @transition-fast;
    }

    &:hover svg,
    &.active svg,
    &[aria-expanded='true'] svg {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 992px) {
    padding: @spacing-sm 0;
    border-bottom: 1px solid @border-color;
    width: 100%;
    justify-content: space-between;

    &.nav-dropdown-trigger {
      justify-content: space-between;
    }

    &.active::after {
      display: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

.nav-dropdown {
  position: relative;

  @media (max-width: 992px) {
    width: 100%;
  }
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 180px;
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-sm 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all @transition-fast;
  box-shadow: 0 8px 24px rgba(74, 64, 58, 0.1);
  z-index: 1001;

  &.dropdown-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  @media (max-width: 992px) {
    position: static;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transform: none;

    &.dropdown-open {
      max-height: 320px;
      opacity: 1;
      visibility: visible;
    }
  }
}

.dropdown-link {
  display: block;
  padding: @spacing-sm @spacing-md;
  color: @text-light;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all @transition-fast;

  &:hover {
    color: @primary-color;
    background: rgba(@primary-color, 0.05);
  }

  &.active {
    color: @primary-color;
    font-weight: 600;
    background: rgba(@primary-color, 0.08);
  }

  @media (max-width: 992px) {
    border-bottom: 1px solid @border-color;

    &:last-child {
      border-bottom: none;
    }
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 30px;
  height: 24px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 992px) {
    display: block;
  }
}

.menu-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: @primary-color;
  transition: @transition-fast;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: @primary-color;
    transition: @transition-fast;
  }

  &::before {
    top: -8px;
  }

  &::after {
    bottom: -8px;
  }

  &.menu-icon-open {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    &::after {
      bottom: 0;
      transform: rotate(-45deg);
    }
  }
}
</style>
