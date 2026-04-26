<template>
  <header class="header">
    <div class="header-container">
      <NuxtLink :to="getLocalePath('/')" class="logo">
        <span class="logo-text">{{ $t('siteName') }}</span>
      </NuxtLink>
      <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
        <!-- Products Dropdown -->
        <div class="nav-dropdown" @mouseenter="showProductsMenu = true" @mouseleave="showProductsMenu = false">
          <button class="nav-link nav-dropdown-trigger" :class="{ active: isProductPage }">
            {{ $t('nav.products') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div class="nav-dropdown-menu" :class="{ 'dropdown-open': showProductsMenu }">
            <NuxtLink :to="getLocalePath('/baby-feeding-bottles')" class="dropdown-link" :class="{ active: isCurrentProduct('/baby-feeding-bottles') }" @click="closeMenu">
              {{ $t('nav.feedingBottles') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-sippy-cups')" class="dropdown-link" :class="{ active: isCurrentProduct('/baby-sippy-cups') }" @click="closeMenu">
              {{ $t('nav.sippyCups') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-tableware')" class="dropdown-link" :class="{ active: isCurrentProduct('/baby-tableware') }" @click="closeMenu">
              {{ $t('nav.tableware') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-bath-potty')" class="dropdown-link" :class="{ active: isCurrentProduct('/baby-bath-potty') }" @click="closeMenu">
              {{ $t('nav.bathPotty') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/baby-milk-powder-container')" class="dropdown-link" :class="{ active: isCurrentProduct('/baby-milk-powder-container') }" @click="closeMenu">
              {{ $t('nav.milkPowderBox') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/other-accessory')" class="dropdown-link" :class="{ active: isCurrentProduct('/other-accessory') }" @click="closeMenu">
              {{ $t('nav.accessories') }}
            </NuxtLink>
          </div>
        </div>
        <NuxtLink :to="getLocalePath('/about-us')" class="nav-link" :class="{ active: isActive('/about-us') }" @click="closeMenu">
          {{ $t('nav.about') }}
        </NuxtLink>
        <NuxtLink :to="getLocalePath('/contact-us')" class="nav-link nav-link-contact" :class="{ active: isActive('/contact-us') }" @click="closeMenu">
          {{ $t('nav.contact') }}
        </NuxtLink>
      </nav>
      <LanguageSwitcher />
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{ 'menu-icon-open': isMenuOpen }" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { $t, getLocalePath, locale } = useI18n()
const isMenuOpen = ref(false)
const showProductsMenu = ref(false)

const isActive = (path: string) => {
  const currentPath = route.path
  // Strip locale prefix for comparison
  let strippedPath = currentPath
  if (currentPath.startsWith('/zh-CN')) {
    strippedPath = currentPath.replace('/zh-CN', '') || '/'
  } else if (currentPath.startsWith('/zh-TW')) {
    strippedPath = currentPath.replace('/zh-TW', '') || '/'
  }
  return strippedPath === path || strippedPath.startsWith(path + '/') || strippedPath.startsWith(path)
}

const isProductPage = computed(() => {
  const productPaths = ['/baby-feeding-bottles', '/baby-sippy-cups', '/baby-tableware', '/baby-bath-potty', '/baby-milk-powder-container', '/other-accessory']
  return productPaths.some(path => isActive(path))
})

// Check if current product page matches specific product path
const isCurrentProduct = (path: string) => {
  return isActive(path)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
  showProductsMenu.value = false
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: @card-background;
  border-bottom: 1px solid @border-color;
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
  color: @primary-color;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav {
  margin-left: auto;
  display: flex;
  gap: @spacing-lg;

  @media (max-width: @breakpoint-tablet) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: @card-background;
    flex-direction: column;
    padding: @spacing-md;
    gap: 0;
    border-bottom: 1px solid @border-color;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: @transition-normal;
    z-index: 999;

    &.nav-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
}

.language-switcher {
  @media (max-width: @breakpoint-tablet) {
    display: none;
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
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;

    svg {
      transition: transform @transition-fast;
    }

    &:hover svg,
    &.active svg {
      transform: rotate(180deg);
    }
  }

  &.nav-link-contact {
    @media (max-width: @breakpoint-tablet) {
      margin-left: 0;
    }
  }

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-sm 0;
    border-bottom: 1px solid @border-color;

    &:last-child {
      border-bottom: none;
    }

    &.active::after {
      display: none;
    }
  }
}

// Dropdown styles
.nav-dropdown {
  position: relative;

  @media (max-width: @breakpoint-tablet) {
    .nav-dropdown-trigger {
      width: 100%;
      justify-content: space-between;
    }
  }
}

.nav-dropdown-menu {
  position: absolute;
  top: 100%;
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;

  &.dropdown-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  @media (max-width: @breakpoint-tablet) {
    position: static;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transform: none;

    &.dropdown-open {
      max-height: 300px;
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

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-sm @spacing-md;
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

  @media (max-width: @breakpoint-tablet) {
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