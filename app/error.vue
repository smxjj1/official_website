<script setup lang="ts">
import type { NuxtError } from '#app';
import { clearError } from '#app';
import { computed } from 'vue';

const props = defineProps<{
  error: NuxtError;
}>();

const route = useRoute();
const statusCode = computed(() => props.error?.statusCode ?? 500);
const title = computed(() => props.error?.statusMessage || 'Oops! Something went wrong');
const stack = computed(() => props.error?.stack);
const message = computed(
  () =>
    props.error?.message
    || 'We ran into an issue while processing your request. Please try again in a moment.',
);

function handleBackHome() {
  clearError({ redirect: '/' });
}

function submitError() {
  // 通常应该给服务器提交错误信息
  // $fetch('/api/log/save', {
  //   method: 'POST',
  //   body: {
  //     errorCode: statusCode.value,
  //     page: route.fullPath,
  //     message: message.value,
  //     stack: stack.value,
  //   },
  // });
}

onMounted(() => {
  submitError();
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]">
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8 lg:px-10">
      <div
        class="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--color-container-border)] bg-[var(--color-base-200)]/90 p-8 shadow-xl backdrop-blur"
      >
        <div class="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[var(--color-primary)]/5 blur-2xl" />
        <div class="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/10 blur-2xl" />

        <div class="relative flex flex-col items-center text-center">
          <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
            <svg
              class="h-12 w-12 text-[var(--color-primary)]"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="error-burst" x1="12%" y1="18%" x2="88%" y2="82%">
                  <stop offset="0%" stop-color="#F23640" />
                  <stop offset="100%" stop-color="var(--color-primary-hover)" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#error-burst)" opacity="0.12" />
              <path
                d="M32 14c-.86 0-1.63.48-2.02 1.24l-14 26.62a2.25 2.25 0 0 0 1.97 3.3h28.1a2.25 2.25 0 0 0 1.97-3.3l-14-26.62A2.24 2.24 0 0 0 32 14zm0 9.8a1.75 1.75 0 0 1 1.75 1.75v9.3a1.75 1.75 0 0 1-3.5 0v-9.3A1.75 1.75 0 0 1 32 23.8zm0 18.73a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6z"
                fill="currentColor"
              />
            </svg>
          </div>

          <p class="text-4xl font-extrabold text-[var(--color-primary)] sm:text-5xl">
            {{ statusCode }}
          </p>
          <h1 class="mt-3 text-3xl font-bold text-[var(--color-base-content)] sm:text-4xl">
            {{ title }}
          </h1>
          <p class="mt-4 text-base leading-relaxed text-[var(--color-secondary-content)] sm:text-lg">
            {{ message }}
          </p>

          <button
            type="button"
            class="mt-8 inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-content)] shadow-lg transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:text-base"
            @click="handleBackHome"
          >
            <span>Back Home</span>
            <svg
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <p class="mt-6 text-xs text-[var(--color-secondary-content)] sm:text-sm">
            If this keeps happening, please contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
