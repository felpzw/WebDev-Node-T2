<template>
  <div class="totem-container">
    <transition name="slide-fade" mode="out-in">
      <div :key="currentSlideIndex" class="slide-content">
        <div v-if="error" class="error-slide">
          <h1>{{ error }}</h1>
          <p>Verifique o token de autenticação e a conexão do servidor.</p>
        </div>
        <div v-else-if="slides.length === 0" class="loading-slide">
          <h1>Conectando ao servidor de slides...</h1>
          <p>Aguardando slides...</p>
        </div>
        <div v-else v-html="currentSlide.content"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  // Options API
  data() {
    return {
      socket: null,
      slides: [],
      currentSlideIndex: 0,
      slideTimer: null,
      error: null,
      // === IMPORTANTE ===
      // Este token DEVE ser o 'authToken' gerado pelo seu backend
      // e salvo na coleção 'totems'.
      // Você deve buscá-lo do seu admin (ex: copiar/colar).
      TOTEM_AUTH_TOKEN: '667077beef347746f720f175652869447ab80d9f534c84be6729bdfe0412fd4f',
    };
  },
  computed: {
    currentSlide() {
      if (this.slides.length > 0) {
        return this.slides[this.currentSlideIndex];
      }
      return { content: '', duration: 10 }; // Default
    },
  },
  methods: {
    connectSocket() {
      // Conecta ao servidor Socket.io (mesma porta do backend)
      // e envia o token de autenticação
      this.socket = io('http://localhost:4000', {
        auth: {
          token: this.TOTEM_AUTH_TOKEN,
        },
      });

      // Lida com erros de conexão (ex: token inválido)
      this.socket.on('connect_error', (err) => {
        this.error = `Erro de Autenticação: ${err.message}`;
        console.error(err);
      });

      // Conectado com sucesso
      this.socket.on('connect', () => {
        this.error = null;
        console.log('Totem conectado e autenticado.');
      });

      // Evento principal: Recebe a lista de slides
      this.socket.on('update-slides', (newSlides) => {
        console.log('Slides recebidos:', newSlides);
        this.slides = newSlides;
        // Reinicia a exibição
        this.currentSlideIndex = 0;
        this.startSlideShow();
      });
      
      // Lida com erros gerais do socket
      this.socket.on('error', (errMsg) => {
         this.error = errMsg;
         console.error('Erro do socket:', errMsg);
      });
    },

    startSlideShow() {
      // Limpa qualquer timer anterior
      if (this.slideTimer) {
        clearTimeout(this.slideTimer);
      }

      if (this.slides.length === 0) {
        return; // Não faz nada se não houver slides
      }

      // Pega a duração do slide atual (em segundos)
      const duration = this.currentSlide.duration * 1000; // Converte para ms

      // Agenda o próximo slide
      this.slideTimer = setTimeout(() => {
        this.nextSlide();
      }, duration);
    },

    nextSlide() {
      // Avança o índice ou volta ao início (loop)
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      // Inicia o timer para o slide que acabamos de exibir
      this.startSlideShow();
    },
  },
  // Quando o componente é montado no DOM
  mounted() {
    this.connectSocket();
  },
  // Quando o componente é destruído
  beforeUnmount() {
    // Limpa o timer
    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
    }
    // Desconecta o socket
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.totem-container {
  /* Fundo preto, ideal para totens */
  background-color: #000;
  color: #fff;
  width: 100%;
  flex-grow: 1; /* Ocupa todo o espaço vertical */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Esconde o conteúdo que transborda */
  
  /* Assume tela cheia, sem padding. O HTML do slide deve se auto-formatar. */
}

.slide-content {
  width: 100%;
  height: 100%;
  padding: 2rem; /* Um padding de segurança */
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

/* Animação de Fade para os slides */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>