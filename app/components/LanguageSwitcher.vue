<template>
  <div class="language-switcher" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
    <button class="globe-btn" aria-label="Switch language">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </button>
    <Transition name="dropdown">
      <div v-if="showDropdown" class="lang-dropdown">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="lang-option"
          :class="{ active: locale === lang.code }"
          @click="handleLocaleChange(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, $t } = useI18n()
const showDropdown = ref(false)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
]

const handleLocaleChange = (code: string) => {
  setLocale(code)
  showDropdown.value = false
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.language-switcher {
  position: relative;
  margin-left: @spacing-md;
}

.globe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: @text-light;
  cursor: pointer;
  border-radius: 50%;
  transition: all @transition-fast;

  &:hover {
    color: @primary-color;
    background: rgba(@primary-color, 0.08);
  }
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 120px;
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-xs 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  margin-top: @spacing-xs;
}

.lang-option {
  display: block;
  width: 100%;
  padding: @spacing-sm @spacing-md;
  background: transparent;
  border: none;
  color: @text-light;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
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
}

// Transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
</style>