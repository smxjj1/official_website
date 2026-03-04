export default function () {
  console.log('[SSRLog] useExample');
  onMounted(() => {
    console.log('[Client] useExample');
  });
};
