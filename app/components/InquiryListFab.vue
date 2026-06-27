<template>
  <Teleport to="body">
    <Transition name="inquiry-toast">
      <div v-if="feedbackMessage" class="inquiry-toast" role="status">
        {{ feedbackMessage }}
      </div>
    </Transition>
  </Teleport>

  <div v-if="count > 0" class="inquiry-fab-root">
    <Transition name="inquiry-panel">
      <div v-if="panelOpen" class="inquiry-panel">
        <div class="panel-header">
          <h3>{{ $t('inquiryList.title') }} ({{ count }})</h3>
          <button type="button" class="panel-close" :aria-label="$t('inquiryList.close')" @click="panelOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <ul class="panel-list">
          <li v-for="item in items" :key="item.itemNo" class="panel-item">
            <div class="item-thumb">
              <img v-if="item.mainImage" :src="item.mainImage" :alt="item.name" loading="lazy">
              <span v-else>{{ item.itemNo.charAt(0) }}</span>
            </div>
            <div class="item-info">
              <strong>{{ item.itemNo }}</strong>
              <p>{{ item.name }}</p>
            </div>
            <button type="button" class="item-remove" :aria-label="$t('inquiryList.remove')" @click="remove(item.itemNo)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </li>
        </ul>

        <div class="panel-footer">
          <button type="button" class="btn-clear" @click="handleClearAll">
            {{ $t('inquiryList.clearAll') }}
          </button>
          <button type="button" class="btn-contact" @click="handleContactFromList">
            {{ $t('inquiryList.contactInquiry') }}
          </button>
        </div>
      </div>
    </Transition>

    <button
      type="button"
      class="inquiry-fab"
      :aria-label="$t('inquiryList.open')"
      @click="panelOpen = !panelOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <span class="fab-badge">{{ badgeText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  contactPath: string
}>()

const { $t } = useI18n()
const {
  items,
  count,
  feedbackMessage,
  remove,
  clear,
  buildProductsQuery,
} = useInquiryList()

const panelOpen = ref(false)

const badgeText = computed(() => (count.value > 99 ? '99+' : String(count.value)))

const handleClearAll = () => {
  if (!count.value) return
  if (import.meta.client && !window.confirm(String($t('inquiryList.clearConfirm')))) return
  clear()
  panelOpen.value = false
}

const handleContactFromList = async () => {
  const products = buildProductsQuery()
  if (!products) return
  clear()
  panelOpen.value = false
  await navigateTo({
    path: props.contactPath,
    query: { products },
  })
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.inquiry-toast {
  position: fixed;
  bottom: 96px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  background: @text-color;
  color: @card-background;
  padding: 10px 18px;
  border-radius: @radius-full;
  font-size: 0.875rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: calc(100vw - 32px);
  text-align: center;
}

.inquiry-fab-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10000;

  @media (max-width: @breakpoint-mobile) {
    right: 16px;
    bottom: 16px;
  }
}

.inquiry-fab {
  position: relative;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: @primary-color;
  color: @card-background;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(224, 122, 95, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(224, 122, 95, 0.55);
  }

  .fab-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: @radius-full;
    background: @secondary-color;
    color: @card-background;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
  }
}

.inquiry-panel {
  position: absolute;
  right: 0;
  bottom: 68px;
  width: 360px;
  max-height: 420px;
  background: @card-background;
  border-radius: @radius-lg;
  box-shadow: 0 8px 32px rgba(74, 64, 58, 0.18);
  border: 1px solid @border-color;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: @breakpoint-mobile) {
    width: calc(100vw - 32px);
    right: -8px;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: @spacing-sm @spacing-md;
  border-bottom: 1px solid @border-light;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: @text-color;
  }

  .panel-close {
    border: none;
    background: transparent;
    color: @text-light;
    cursor: pointer;
    padding: 4px;
    display: flex;

    &:hover {
      color: @primary-color;
    }
  }
}

.panel-list {
  list-style: none;
  margin: 0;
  padding: @spacing-xs 0;
  overflow-y: auto;
  flex: 1;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px @spacing-md;
  border-bottom: 1px solid @border-light;

  &:last-child {
    border-bottom: none;
  }
}

.item-thumb {
  width: 44px;
  height: 44px;
  border-radius: @radius-sm;
  background: @section-background;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: @primary-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-info {
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 0.875rem;
    color: @text-color;
  }

  p {
    margin: 2px 0 0;
    font-size: 0.75rem;
    color: @text-light;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.item-remove {
  border: none;
  background: transparent;
  color: @text-muted;
  cursor: pointer;
  padding: 6px;
  flex-shrink: 0;

  &:hover {
    color: @primary-color;
  }
}

.panel-footer {
  display: flex;
  gap: @spacing-xs;
  padding: @spacing-sm @spacing-md;
  border-top: 1px solid @border-light;
}

.btn-clear,
.btn-contact {
  flex: 1;
  padding: 10px 12px;
  border-radius: @radius-sm;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background @transition-fast, color @transition-fast;
}

.btn-clear {
  border: 1px solid @border-color;
  background: transparent;
  color: @text-light;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
  }
}

.btn-contact {
  border: none;
  background: @primary-color;
  color: @card-background;

  &:hover {
    background: lighten(@primary-color, 6%);
  }
}

.inquiry-toast-enter-active,
.inquiry-toast-leave-active,
.inquiry-panel-enter-active,
.inquiry-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.inquiry-toast-enter-from,
.inquiry-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.inquiry-panel-enter-from,
.inquiry-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
