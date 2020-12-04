<template>
  <div id="app">
    <div id="title">
      <h2>Isle of the Dead, Arnold Böcklin</h2>
    </div>
    <div id="sectionTitle">
      <h2>
        <transition name="fade">
          <div :key="`slideTitle${slideIndex}`">
            {{ currentSlide.title }}
          </div>
        </transition>
      </h2>
    </div>
    <Painting :reveal="reveal" :images="images" />
    <main id="slides">
      <transition name="slide">
        <component v-bind:is="currentSlide.component"></component>
      </transition>
    </main>
    <div id="credits">
      <span>Thaïs Rousselle & Jean-Nicolas Veigel</span>
    </div>
    <div id="buttons" v-if="isAdmin">
      <button @click="prevSlide">Previous</button>
      <button @click="nextSlide">Next</button>
    </div>
    <div id="slideCounter" v-if="!isAdmin && !showAdminLogin">
      <span>Slide {{ slideIndex + 1 }} of {{ slides.length }}</span>
      <button @click="showAdminLogin = true">admin login</button>
    </div>
    <div id="adminLogin" v-if="!isAdmin && showAdminLogin">
      <form @submit.prevent="submitLogin">
        <input
          type="password"
          autocomplete="off"
          placeholder="admin password"
        />
      </form>
      <button @click="showAdminLogin = false">hide</button>
    </div>
  </div>
</template>

<script>
//packages
import { io } from 'socket.io-client';

//components
import Painting from '@/components/Painting';

//slides
import Intro from '@/components/slides/Intro';
import DescSubjects from '@/components/slides/DescSubjects';
import DescTechnique from '@/components/slides/DescTechnique';
import Interpretation from '@/components/slides/Interpretation';
import Conclusion from '@/components/slides/Conclusion';

export default {
  name: 'App',
  components: {
    Intro,
    Painting,
  },
  data() {
    return {
      reveal: false,
      socket: null,
      showAdminLogin: false,
      isAdmin: false,
      slides: [
        {
          title: 'Introduction',
          component: Intro,
        },
        {
          title: 'Description \u2014 Subjects',
          component: DescSubjects,
        },
        {
          title: 'Description \u2014 Technique',
          component: DescTechnique,
        },
        {
          title: 'Interpretation',
          component: Interpretation,
        },
        {
          title: 'Conclusion',
          component: Conclusion,
        },
      ],
      images: [
        {
          url:
            'https://i0.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_I_Kunstmuseum_Basel.jpg?ssl=1',
          date: 1880,
        },
        {
          url:
            'https://i0.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_II_Metropolitan_Museum_of_Art-scaled.jpg?resize=2048%2C1243&ssl=1',
          date: 1880,
        },
        {
          url:
            'https://i2.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_III_Alte_Nationalgalerie_Berlin-scaled.jpg?resize=2048%2C1091&ssl=1',
          date: 1883,
        },
        {
          url:
            'https://i1.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold-B%C3%B6cklin-The-Isle-of-the-Dead-Die-Toteninsel-The-fourth-version.jpg?w=1417&ssl=1',
          date: 1884,
        },
        {
          url:
            'https://i1.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/1920px-Arnold_B%C3%B6cklin_-_Die_Toteninsel_V_Museum_der_bildenden_K%C3%BCnste_Leipzig.jpg?w=1920&ssl=1',
          date: 1886,
        },
      ],
    };
  },
  computed: {
    slideIndex: {
      get() {
        return this.$store.state.slideIndex || 0;
      },
      set(val) {
        this.$store.commit('setSlideIndex', val);
      },
    },
    currentSlide() {
      return this.slides[this.slideIndex];
    },
    slideCount() {
      return this.slides.length;
    },
  },
  methods: {
    submitLogin(e) {
      const { value } = e.target.children[0];
      if (value === process.env.VUE_APP_ADMIN_PASSWORD) {
        this.isAdmin = true;
      }
    },
    initSocket() {
      const serverUrl = process.env.VUE_APP_SERVER_URL;
      this.socket = io(serverUrl);

      this.socket.on('lastSlideIndex', ({ index }) => {
        this.setSlideIndex(index);
      });

      this.socket.on('slideChange', ({ index }) => {
        this.setSlideIndex(index);
      });

      this.socket.emit('getLastSlideIndex');
    },
    setSlideIndex(index) {
      this.$store.commit('setSlideIndex', index);
      this.revealVersions(index);
    },
    revealVersions(index) {
      if (index > 1 && !this.reveal) {
        this.reveal = true;
      }
    },
    emitSlideChange(index) {
      this.revealVersions(index);
      if (this.isAdmin) {
        this.socket.emit('setSlideIndex', { index });
      }
    },
    nextSlide() {
      if (this.slideIndex < this.slideCount - 1) {
        this.slideIndex += 1;
      }
      this.$nextTick(() => this.emitSlideChange(this.slideIndex));
    },
    prevSlide() {
      if (this.slideIndex > 0) {
        this.slideIndex -= 1;
      }

      this.$nextTick(() => this.emitSlideChange(this.slideIndex));
    },
  },
  created() {
    this.initSocket();
  },
  mounted() {
    setTimeout(() => {
      document
        .getElementById('app')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000);
  },
};
</script>

<style lang="scss">
@mixin between {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

@mixin border($pos: bottom) {
  border-#{$pos}: 1px solid #212122;
  padding-#{$pos}: 0.5rem;
}

.slide-leave-active {
  transition-duration: 0.6s;
  & h2 {
    height: 1rem;
  }
}

.slide-enter-active {
  transition-delay: 0.6s;
  transition-duration: 0.3s;

  & h2 {
    height: 1rem;
  }
}

.slide-enter {
  transform: translateY(75px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-75px);
  opacity: 0;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  position: absolute;
  transition-duration: 0.6s;
}

.fade-enter {
  transition-delay: 0.6s;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #212122;
  border-color: #212122;
  font-family: 'Space Grotesk', sans-serif;
  --spacing: 1rem;
}

body,
html {
  overflow: hidden;
  height: 100%;
}

h2 {
  overflow: hidden;

  &.fade-enter-active {
    transition-delay: 0.6s;
  }
}

h4 {
  margin-bottom: 1rem;
}

h3 {
  text-decoration: underline;
  margin-bottom: 1rem;
  margin-top: 2rem;

  &:first-child {
    margin-top: 0;
  }
}

p {
  margin-bottom: calc(var(--spacing) / 2);
}

button,
p,
span {
  font-size: 1rem;
  line-height: 1.3rem;
}

ol {
  padding-left: calc(var(--spacing) * 2);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #cecece;

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 6fr 4fr;
  grid-gap: var(--spacing);
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding: var(--spacing);
  overflow: hidden;

  .quote {
    text-align: right;
  }

  #title {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
    border-bottom: 1px solid #212122;
    padding-bottom: calc(var(--spacing) / 2);
    align-self: end;
  }

  #sectionTitle {
    grid-row: 1 / 1;
    grid-column: 2 / 2;
    border-bottom: 1px solid #212122;
    padding-bottom: calc(var(--spacing) / 2);
    align-self: end;
  }

  #slides {
    grid-column: 2 / 2;
    overflow: hidden;
    grid-row: 2 / 2;
  }

  #credits {
    grid-row: 3 / 3;
    grid-column: 1 / 1;
    @include border(top);
    align-self: end;
  }

  #buttons,
  #adminLogin,
  #slideCounter {
    @include between;
    @include border(top);
    grid-row: 3 / 3;
    grid-column: 2 / 2;

    button {
      border: 0;
      text-decoration: underline;
      background: none;
    }

    input {
      background: #eeeeee;
      border: 1px solid #212122;
    }
  }
}

@media only screen and (max-width: 700px) {
  * {
    --spacing: 0.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  ol {
    padding-left: calc(var(--spacing) * 3);
  }

  #app {
    grid-template-columns: auto auto;
    grid-template-rows: auto 1fr auto 1fr auto;
    height: 100%;
    min-height: 100%;

    #title {
      grid-column: 1 / -1;
      grid-row: 1 / 1;
    }

    #sectionTitle {
      grid-column: 1 / -1;
      grid-row: 3 / 3;
      * {
        transition-duration: 0.6s;
      }
    }

    #slides {
      grid-column: 1 / -1;
      grid-row: 4 / 4;
      overflow-y: auto;
    }

    #credits {
      display: none;
    }

    #buttons,
    #adminLogin,
    #slideCounter {
      grid-column: 1 / -1;
      grid-row: 5 / 5;
    }
  }
}
</style>
