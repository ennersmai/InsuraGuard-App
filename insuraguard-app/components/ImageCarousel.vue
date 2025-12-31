<template>
  <div class="carousel-container">
    <div class="image-grid">
      <div
        v-for="(img, index) in currentImages"
        :key="`${img}-${index}`"
        class="image-item"
      >
        <div class="aspect-[4/3] max-w-[400px] mx-auto bg-gray-100 rounded-lg overflow-hidden relative">
          <img
            v-if="previousImages[index] && previousImages[index] !== img"
            :src="previousImages[index]"
            :alt="`Previous Shield ${index + 1}`"
            class="w-full h-full object-contain absolute inset-0 previous-image"
            loading="lazy"
          />
          <img
            :src="img"
            :alt="`Shield ${index + 1}`"
            class="w-full h-full object-contain current-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  '/1_shield.webp',
  '/2_shield.webp',
  '/3_shield.webp',
  '/4_shield.webp',
  '/woman_shield.webp'
];

const currentImages = ref<string[]>([]);
const previousImages = ref<string[]>([]);
let intervalId: NodeJS.Timeout | null = null;
let slideIndex = 0;

const getSlideImages = (index: number) => {
  const slideImages = [];
  const imageCount = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  for (let i = 0; i < imageCount; i++) {
    const imageIndex = (index + i) % images.length;
    slideImages.push(images[imageIndex]);
  }
  return slideImages;
};

const updateImages = () => {
  previousImages.value = [...currentImages.value];
  currentImages.value = getSlideImages(slideIndex);
  slideIndex = (slideIndex + 1) % images.length;
};

const startCarousel = () => {
  updateImages(); // Initial load
  intervalId = setInterval(() => {
    updateImages();
  }, 3000);
};

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  min-height: 300px;
}

@media (min-width: 640px) {
  .carousel-container {
    min-height: 250px;
  }
}

@media (min-width: 1024px) {
  .carousel-container {
    min-height: 200px;
  }
}

.image-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.image-item {
  display: flex;
  justify-content: center;
}

.previous-image {
  opacity: 1;
  transition: opacity 0.8s ease-in-out;
}

.current-image {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  animation: fadeIn 0.8s ease-in-out forwards;
  animation-delay: 0.1s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}
</style>
