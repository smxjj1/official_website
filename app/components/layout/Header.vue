<template>
  <header class="header">
    <div class="header-container">
      <NuxtLink to="/" class="logo" :class="{ active: route.path === '/' }">
        <span class="logo-text">Oya Plastic Factory</span>
      </NuxtLink>
      <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
        <NuxtLink to="/baby-feeding-bottles" class="nav-link" :class="{ active: route.path === '/baby-feeding-bottles' }" @click="closeMenu">
          Feeding Bottles
        </NuxtLink>
        <NuxtLink to="/baby-sippy-cups" class="nav-link" :class="{ active: route.path === '/baby-sippy-cups' }" @click="closeMenu">
          Sippy Cups
        </NuxtLink>
        <NuxtLink to="/baby-tableware" class="nav-link" :class="{ active: route.path === '/baby-tableware' }" @click="closeMenu">
          Tableware
        </NuxtLink>
        <NuxtLink to="/baby-bath-potty" class="nav-link" :class="{ active: route.path === '/baby-bath-potty' }" @click="closeMenu">
          Bath & Potty
        </NuxtLink>
        <NuxtLink to="/baby-milk-powder-container" class="nav-link" :class="{ active: route.path === '/baby-milk-powder-container' }" @click="closeMenu">
          Milk Powder Box
        </NuxtLink>
        <NuxtLink to="/other-accessory" class="nav-link" :class="{ active: route.path === '/other-accessory' }" @click="closeMenu">
          Accessories
        </NuxtLink>
        <NuxtLink to="/about-us" class="nav-link" :class="{ active: route.path === '/about-us' }" @click="closeMenu">
          About Us
        </NuxtLink>
        <NuxtLink to="/contact-us" class="nav-link nav-link-contact" :class="{ active: route.path === '/contact-us' }" @click="closeMenu">
          Contact Us
        </NuxtLink>
      </nav>
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{ 'menu-icon-open': isMenuOpen }" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
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