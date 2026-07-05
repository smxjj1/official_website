<template>
  <section class="home-faq">
    <div class="faq-container">
      <HomeSectionHeader
        :title="$t('faq.title')"
        :description="$t('faq.subtitle')"
      />

      <div class="faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-item"
          :class="{ active: openItems.includes(index) }"
        >
          <button
            class="faq-header"
            @click="toggleItem(index)"
            :aria-expanded="openItems.includes(index)"
          >
            <span class="faq-question">{{ item.question }}</span>
            <span class="faq-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline v-if="!openItems.includes(index)" points="6 9 12 15 18 9"/>
                <polyline v-else points="18 15 12 9 6 15"/>
              </svg>
            </span>
          </button>
          <Transition name="expand">
            <div v-show="openItems.includes(index)" class="faq-content">
              <p>{{ item.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="faq-cta">
        <p>{{ $t('faq.stillHaveQuestions') }}</p>
        <NuxtLink :to="getLocalePath('/contact-us')" class="contact-link">
          {{ $t('faq.contactTeam') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

const openItems = ref<number[]>([])

// Get FAQ items from i18n
const faqItems = computed(() => {
  const items = $t('faq.items')
  if (Array.isArray(items)) {
    return items.map((item: any) => ({
      question: item.question,
      answer: item.answer,
    }))
  }
  return []
})

const toggleItem = (index: number) => {
  const idx = openItems.value.indexOf(index)
  if (idx > -1) {
    openItems.value.splice(idx, 1)
  } else {
    openItems.value.push(index)
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.home-faq {
  background: @card-background;
  padding: 100px 0;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.faq-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }

  :deep(.section-header) {
    margin-bottom: @spacing-xl;
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: @spacing-sm;
}

.faq-item {
  border: 1px solid @border-color;
  border-radius: @radius-md;
  overflow: hidden;
  transition: box-shadow @transition-fast;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  &.active {
    border-color: @primary-color-dark;

    .faq-header {
      background: @background-color;
    }

    .faq-icon {
      color: @primary-color-dark;
    }
  }
}

.faq-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: @spacing-md;
  padding: @spacing-md;
  background: @card-background;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background @transition-fast;

  &:hover {
    background: @background-color;
  }
}

.faq-question {
  font-size: 1rem;
  font-weight: 500;
  color: @text-color;
  flex: 1;

  @media (max-width: @breakpoint-tablet) {
    font-size: 0.9rem;
  }
}

.faq-icon {
  flex-shrink: 0;
  color: @text-light-accessible;
  transition: color @transition-fast;
}

.faq-content {
  padding: 0 @spacing-md @spacing-md;

  p {
    font-size: 0.9rem;
    line-height: 1.7;
    color: @text-light-accessible;
    margin: 0;
    white-space: pre-line;
  }
}

.faq-cta {
  text-align: center;
  margin-top: @spacing-xl;
  padding-top: @spacing-lg;
  border-top: 1px solid @border-color;

  p {
    font-size: 0.9rem;
    color: @text-light-accessible;
    margin: 0 0 @spacing-sm;
  }
}

.contact-link {
  display: inline-block;
  padding: @spacing-sm @spacing-lg;
  background: @primary-color-dark;
  color: white;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast;

  &:hover {
    background: lighten(@primary-color-dark, 8%);
  }
}

// Transition
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>