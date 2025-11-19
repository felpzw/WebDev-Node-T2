<template>
  <div class="totem-container">
    <transition name="slide-fade" mode="out-in">
      <div :key="currentSlideIndex" class="slide-content">
        <div v-if="error" class="error-slide">
          <h1>{{ error }}</h1>
          <p>Check the authentication token and server connection.</p>
        </div>
        <div v-else-if="slides.length === 0" class="loading-slide">
          <h1>Connecting to slides server...</h1>
          <p>Waiting for slides...</p>
        </div>
        <div v-else v-html="currentSlide.content"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      slides: [],
      currentSlideIndex: 0,
      slideTimer: null,
      error: null,
      token: null,
    };
  },
  computed: {
    currentSlide() {
      if (this.slides.length > 0) {
        return this.slides[this.currentSlideIndex];
      }
      return { content: '', duration: 10 }; 
    },
  },
  methods: {
    requestToken() {
      let inputToken = null;
      while (!inputToken) {
        inputToken = prompt("Totem Access: Please enter the Authentication Token");
      }
      this.token = inputToken.trim();
      this.connectSocket();
    },

    connectSocket() {
      if (!this.token) {
        this.requestToken();
        return;
      }

      this.socket = io({
        auth: {
          token: this.token,
        },
      });

      this.socket.on('connect_error', (err) => {
        console.error('Authentication Error:', err.message);
        this.error = `Authentication Failed: ${err.message}`;
        
        this.token = null;
        
        if (this.socket) {
          this.socket.disconnect();
        }
        
        setTimeout(() => {
          this.error = null;
          this.requestToken();
        }, 2000);
      });

      this.socket.on('connect', () => {
        this.error = null;
        console.log('Totem connected and authenticated.');
      });

      this.socket.on('update-slides', (newSlides) => {
        console.log('Slides received:', newSlides);
        this.slides = newSlides;
        this.currentSlideIndex = 0;
        this.startSlideShow();
      });
      
      this.socket.on('error', (errMsg) => {
         this.error = errMsg;
         console.error('Error on Socket:', errMsg);
      });
    },

    startSlideShow() {
      if (this.slideTimer) {
        clearTimeout(this.slideTimer);
      }

      if (this.slides.length === 0) {
        return;
      }

      const duration = this.currentSlide.duration * 1000; 

      this.slideTimer = setTimeout(() => {
        this.nextSlide();
      }, duration);
    },

    nextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      this.startSlideShow();
    },
  },

  mounted() {
    this.connectSocket();
  },
  
  beforeUnmount() {
    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.totem-container {
  background-color: #000;
  color: #fff;
  width: 100%;
  flex-grow: 1; 
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
}

.slide-content {
  width: 100%;
  height: 100%;
  padding: 2rem; 
}

.loading-slide,
.error-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.loading-slide h1 {
  font-size: 3rem;
  color: #ccc;
}
.loading-slide p {
  font-size: 1.5rem;
  color: #777;
}

.error-slide h1 {
  font-size: 3rem;
  color: #e57373;
}
.error-slide p {
  font-size: 1.5rem;
  color: #c94a4a;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>