<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-container">
        <h1 class="hero-title">{{ $t('contact.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('contact.heroSubtitle') }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contact-content">
      <div class="content-container">
        <!-- Contact Form -->
        <div class="form-section">
          <h2 class="section-title">{{ $t('contact.formTitle') }}</h2>
          <p class="section-subtitle">{{ $t('contact.formSubtitle') }}</p>

          <form class="contact-form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="name">{{ $t('contact.name') }} <span class="required">*</span></label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :placeholder="$t('contact.namePlaceholder')"
                  :class="{ error: errors.name }"
                />
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label for="email">{{ $t('contact.email') }} <span class="required">*</span></label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :placeholder="$t('contact.emailPlaceholder')"
                  :class="{ error: errors.email }"
                />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">{{ $t('contact.phone') }}</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  :placeholder="$t('contact.phonePlaceholder')"
                />
              </div>
              <div class="form-group">
                <label for="company">{{ $t('contact.company') }}</label>
                <input
                  id="company"
                  v-model="form.company"
                  type="text"
                  :placeholder="$t('contact.companyPlaceholder')"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="address">{{ $t('contact.address') }}</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                :placeholder="$t('contact.addressPlaceholder')"
              />
            </div>

            <div class="form-group">
              <label for="subject">{{ $t('contact.subject') }}</label>
              <select id="subject" v-model="form.subject">
                <option value="">{{ $t('contact.subjectPlaceholder') }}</option>
                <option value="quote">{{ $t('contact.subjectQuote') }}</option>
                <option value="customization">{{ $t('contact.subjectCustomization') }}</option>
                <option value="partnership">{{ $t('contact.subjectPartnership') }}</option>
                <option value="support">{{ $t('contact.subjectSupport') }}</option>
                <option value="other">{{ $t('contact.subjectOther') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="products">{{ $t('contact.products') }}</label>
              <input
                id="products"
                v-model="form.products"
                type="text"
                :placeholder="$t('contact.productsPlaceholder')"
              />
            </div>

            <div class="form-group">
              <label for="message">{{ $t('contact.message') }} <span class="required">*</span></label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                :placeholder="$t('contact.messagePlaceholder')"
                :class="{ error: errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">{{ $t('contact.sendButton') }}</span>
              <span v-else>{{ $t('contact.sendingButton') }}</span>
            </button>

            <!-- Success/Error Messages -->
            <Transition name="fade">
              <div v-if="submitStatus === 'success'" class="form-status success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{{ $t('contact.successMessage') }}</span>
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="submitStatus === 'error'" class="form-status error">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ $t('contact.errorMessage') }}</span>
              </div>
            </Transition>
          </form>
        </div>

        <!-- Contact Info Sidebar -->
        <div class="info-section">
          <!-- Contact Cards -->
          <div class="contact-cards">
            <h3 class="info-title">{{ $t('contact.infoTitle') }}</h3>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>{{ $t('contact.addressLabel') }}</h4>
                <p>{{ $t('contact.addressValue') }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>{{ $t('contact.emailLabel') }}</h4>
                <p>{{ $t('contact.emailValue') }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>{{ $t('contact.whatsappLabel') }}</h4>
                <p>{{ $t('contact.whatsappValue') }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>{{ $t('contact.hoursLabel') }}</h4>
                <p>{{ $t('contact.hoursValue') }}</p>
              </div>
            </div>
          </div>

          <!-- Mission Statement -->
          <div class="mission-card">
            <h3>{{ $t('contact.missionTitle') }}</h3>
            <p>{{ $t('contact.missionText') }}</p>
          </div>

          <!-- Quick Links -->
          <div class="quick-links">
            <h3>{{ $t('contact.productsLinkTitle') }}</h3>
            <div class="links-grid">
              <NuxtLink
                v-for="category in categories"
                :key="category.slug"
                :to="getLocalePath(getCategoryLink(category.slug))"
                class="quick-link"
              >
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories } from '~/data/product-categories'
import { useAnalytics } from '~/composables/useAnalytics'

definePageMeta({
  layout: 'default',
})

const { $t, getLocalePath } = useI18n()
const { sendContactAnalytics } = useAnalytics()
const config = useRuntimeConfig()

useSeo({
  title: 'Contact Us | Oya Plastic Factory',
  description: 'Get in touch with Oya Plastic Factory for premium baby products. Request a quote and we will respond within 24 hours.',
})

const categories = getAllCategories()

// Get category link
const getCategoryLink = (slug: string): string => {
  const linkMap: Record<string, string> = {
    'feeding-bottles': '/baby-feeding-bottles',
    'water-cups': '/baby-sippy-cups',
    'baby-tableware': '/baby-tableware',
    'bath-potty': '/baby-bath-potty',
    'milk-powder-container': '/baby-milk-powder-container',
    'accessories': '/other-accessory',
  }
  return linkMap[slug] || '/other-accessory'
}

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  subject: '',
  products: '',
  message: '',
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

// Form validation
const validateForm = () => {
  let isValid = true

  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate name
  if (!form.name.trim()) {
    errors.name = $t('contact.nameRequired')
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = $t('contact.emailRequired')
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = $t('contact.emailInvalid')
    isValid = false
  }

  // Validate message
  if (!form.message.trim()) {
    errors.message = $t('contact.messageRequired')
    isValid = false
  }

  return isValid
}

// Get API endpoint based on environment
const getApiEndpoint = () => {
  const baseUrl = config.public.analyticsBaseUrl as string
  if (import.meta.dev) {
    return '/api/contact'
  }
  return `${baseUrl}/api/contact`
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    // Main API call
    const response = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        address: form.address,
        subject: form.subject,
        products: form.products,
        message: form.message,
        website: 'oya',
      }),
    })

    if (!response.ok) {
      throw new Error('Request failed')
    }

    // Success
    submitStatus.value = 'success'

    // Fire analytics call (non-blocking)
    sendContactAnalytics({
      name: form.name,
      email: form.email,
      message: form.message,
    })

    // Reset form
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })

    // Clear success message after 5 seconds
    setTimeout(() => {
      submitStatus.value = 'idle'
    }, 5000)
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.contact-page {
  background: @background-color;
  min-height: 100vh;
}

// Hero Section
.contact-hero {
  background: @primary-color;
  padding: 100px @spacing-md;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px @spacing-sm;
  }
}

.hero-container {
  max-width: @breakpoint-desktop;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @card-background;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

// Content Section
.contact-content {
  padding: 100px 0;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.content-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    padding: 0 @spacing-md;
    gap: @spacing-xl;
  }
}

// Form Section
.form-section {
  background: @card-background;
  padding: @spacing-xl;
  border-radius: @radius-lg;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-lg;
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-xs;
}

.section-subtitle {
  font-size: 0.9rem;
  color: @text-light;
  margin: 0 0 @spacing-xl;
}

// Form Styles
.contact-form {
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-md;

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: @text-color;

    .required {
      color: #C4644A;
    }
  }

  input,
  select,
  textarea {
    padding: @spacing-sm;
    border: 1px solid @border-color;
    border-radius: @radius-sm;
    font-size: 1rem;
    color: @text-color;
    background: @card-background;
    transition: border-color @transition-fast, box-shadow @transition-fast;

    &::placeholder {
      color: @text-light;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      border-color: @primary-color;
      box-shadow: 0 0 0 3px rgba(@primary-color, 0.1);
    }

    &.error {
      border-color: @accent-color;
    }
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right @spacing-sm center;
    padding-right: @spacing-xl;
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .error-message {
    font-size: 0.75rem;
    color: red;
  }
}

.submit-btn {
  padding: @spacing-sm @spacing-xl;
  background: @primary-color;
  color: @card-background;
  border: none;
  border-radius: @radius-sm;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background @transition-fast, transform @transition-fast;

  &:hover:not(:disabled) {
    background: lighten(@primary-color, 8%);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.form-status {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-md;
  border-radius: @radius-sm;
  font-size: 0.9rem;

  &.success {
    background: #E8F5E9;
    color: #5A8F5E;
    border: 1px solid #C5E1C5;
  }

  &.error {
    background: #FFEBE6;
    color: #C4644A;
    border: 1px solid #F0D4CA;
  }
}

// Info Section
.info-section {
  display: flex;
  flex-direction: column;
  gap: @spacing-lg;
}

.info-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-sm;
}

.contact-cards {
  background: @card-background;
  padding: @spacing-lg;
  border-radius: @radius-lg;
}

.info-card {
  display: flex;
  gap: @spacing-md;
  padding: @spacing-md 0;
  border-bottom: 1px solid @border-color;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
}

.info-icon {
  width: 48px;
  height: 48px;
  background: @background-color;
  border-radius: @radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @primary-color;
  flex-shrink: 0;
}

.info-content {
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: @text-color;
    margin: 0 0 @spacing-xs;
  }

  p {
    font-size: 0.9rem;
    color: @text-light;
    margin: 0;
    line-height: 1.6;
  }
}

// Mission Card
.mission-card {
  background: @primary-color;
  padding: @spacing-lg;
  border-radius: @radius-lg;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: @card-background;
    margin: 0 0 @spacing-sm;
  }

  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    line-height: 1.7;
  }
}

// Quick Links
.quick-links {
  background: @card-background;
  padding: @spacing-lg;
  border-radius: 12px;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: @text-color;
    margin: 0 0 @spacing-md;
  }
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-xs;
}

.quick-link {
  display: inline-block;
  padding: @spacing-xs @spacing-sm;
  background: @background-color;
  color: @text-light;
  font-size: 0.8rem;
  text-decoration: none;
  border-radius: 4px;
  transition: all @transition-fast;

  &:hover {
    background: @primary-color;
    color: @card-background;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>