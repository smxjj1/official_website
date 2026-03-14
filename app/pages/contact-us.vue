<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-container">
        <h1 class="hero-title">Get in Touch</h1>
        <p class="hero-subtitle">
          We're a dedicated manufacturer of premium baby products, offering one-stop solutions for your business needs. Request a quote and we'll respond within 24 hours.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contact-content">
      <div class="content-container">
        <!-- Contact Form -->
        <div class="form-section">
          <h2 class="section-title">Request a Quote</h2>
          <p class="section-subtitle">Fill out the form below and our team will get back to you promptly.</p>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name <span class="required">*</span></label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="Your name"
                  :class="{ error: errors.name }"
                  required
                />
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="your@email.com"
                  :class="{ error: errors.email }"
                  required
                />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div class="form-group">
                <label for="company">Company</label>
                <input
                  id="company"
                  v-model="form.company"
                  type="text"
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="address">Address</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="Your address"
              />
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <select id="subject" v-model="form.subject">
                <option value="">Select a subject</option>
                <option value="quote">Request a Quote</option>
                <option value="customization">Product Customization</option>
                <option value="partnership">Business Partnership</option>
                <option value="support">Customer Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="products">Products Required</label>
              <input
                id="products"
                v-model="form.products"
                type="text"
                placeholder="e.g., Feeding bottles, Water cups, etc."
              />
            </div>

            <div class="form-group">
              <label for="message">Message <span class="required">*</span></label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                placeholder="Tell us about your requirements..."
                :class="{ error: errors.message }"
                required
              ></textarea>
              <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else>Sending...</span>
            </button>

            <!-- Success/Error Messages -->
            <Transition name="fade">
              <div v-if="submitStatus === 'success'" class="form-status success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Thank you! We'll get back to you within 24 hours.</span>
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="submitStatus === 'error'" class="form-status error">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>Something went wrong. Please try again.</span>
              </div>
            </Transition>
          </form>
        </div>

        <!-- Contact Info Sidebar -->
        <div class="info-section">
          <!-- Contact Cards -->
          <div class="contact-cards">
            <h3 class="info-title">Contact Information</h3>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>Address</h4>
                <p>Nanxin Road, Nanwan Street<br>Longgang District, Shenzhen<br>Guangdong, China</p>
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
                <h4>Email</h4>
                <p>info@wajababy.com</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>Phone</h4>
                <p>+86 139 2527 8649</p>
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
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9:00 - 18:00<br>Saturday: 9:00 - 12:00</p>
              </div>
            </div>
          </div>

          <!-- Mission Statement -->
          <div class="mission-card">
            <h3>Our Mission</h3>
            <p>
              We are dedicated to crafting high-quality, safe, and innovative baby products that support families worldwide. Our commitment to excellence drives us to deliver products that meet the highest international safety standards.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="quick-links">
            <h3>Our Products</h3>
            <div class="links-grid">
              <NuxtLink
                v-for="category in categories"
                :key="category.slug"
                :to="`/products/${category.slug}`"
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

definePageMeta({
  layout: 'default',
})

useSeo({
  title: 'Contact Us | Waja Baby',
  description: 'Get in touch with Waja Baby for premium baby products. Request a quote and we will respond within 24 hours.',
})

const categories = getAllCategories()

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
    errors.name = 'Name is required'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  // Validate message
  if (!form.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  }

  return isValid
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Success
    submitStatus.value = 'success'

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
    color: #C4644A;
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