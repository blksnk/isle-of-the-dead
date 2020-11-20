<template>
  <div id="app">
    <div id='title'>
      <h2>Isle of the Dead, Arnold Böcklin</h2>
    </div>
    <div id="sectionTitle">
      <h2>{{ currentSlide.title }}</h2>
    </div>
    <Painting :reveal="reveal" :images="images" />
    <main id="slides">
      <component v-bind:is="currentSlide.component"></component>
    </main>
    <div id="credits">
      <span>Thaïs Rousselle & Jean-Nicolas Veigel</span>
    </div>
    <div id="buttons" v-if="isAdmin">
      <button @click="prevSlide">Previous</button>
      <button @click="nextSlide">Next</button>
    </div>
    <div id='adminLogin' v-if="!isAdmin && showAdminLogin">
      <form @submit.prevent="submitLogin">
        <input type="password" placeholder="admin password">
      </form>
      <button @click="showAdminLogin = false">hide</button>
    </div>
  </div>
</template>

<script>
//packages
import { io } from 'socket.io-client'

//components
import Painting from '@/components/Painting'

//slides
import Intro from '@/components/slides/Intro'
import DescSubjects from '@/components/slides/DescSubjects'
import DescTechnique from '@/components/slides/DescTechnique'

export default {
  name: 'App',
  components: {
    Intro,
    Painting,
  },
  data() {
    return {
      slideIndex: 0,
      reveal: false,
      socket: null,
      showAdminLogin: true,
      isAdmin: false,
      slides: [{
          title: 'Introduction',
          component: Intro,
        },
        {
          title: 'Description \u2014 Subjects',
          component: DescSubjects
        },
        {
          title: 'Description \u2014 Technique',
          component: DescTechnique
        },
      ],
      images: [{
          url: 'https://i0.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_I_Kunstmuseum_Basel.jpg?ssl=1',
          date: 1880,
        },
        {
          url: 'https://i0.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_II_Metropolitan_Museum_of_Art-scaled.jpg?resize=2048%2C1243&ssl=1',
          date: 1880,
        },
        {
          url: 'https://i2.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold_B%C3%B6cklin_-_Die_Toteninsel_III_Alte_Nationalgalerie_Berlin-scaled.jpg?resize=2048%2C1091&ssl=1',
          date: 1883,
        },
        {
          url: 'https://i1.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/Arnold-B%C3%B6cklin-The-Isle-of-the-Dead-Die-Toteninsel-The-fourth-version.jpg?w=1417&ssl=1',
          date: 1884,
        },
        {
          url: 'https://i1.wp.com/www.sensesatlas.com/wp-content/uploads/2020/04/1920px-Arnold_B%C3%B6cklin_-_Die_Toteninsel_V_Museum_der_bildenden_K%C3%BCnste_Leipzig.jpg?w=1920&ssl=1',
          date: 1886,
        },
      ],
    }
  },
  computed: {
    currentSlide() {
      return this.slides[this.slideIndex]
    },
    slideCount() {
      return this.slides.length
    }
  },
  methods: {
    submitLogin(e) {
      const {value} = e.target.children[0]
      if(value === process.env.VUE_APP_ADMIN_PASSWORD) {
        this.isAdmin = true;
      }
    },
    initSocket() {
      const serverUrl = process.env.VUE_APP_SERVER_URL;
      this.socket = io(serverUrl);

      this.socket.on('slideChange', ({ index }) => {
        this.setSlideIndex(index)
      })
    },
    setSlideIndex(index) {
      this.slideIndex = index;
      this.revealVersions(index);
    },
    revealVersions(index) {
      if (index > 1 && !this.reveal) {
        this.reveal = true;
      }
    },
    emitSlideChange(index) {
      this.revealVersions(index);
      if(this.isAdmin) {
        this.socket.emit('setSlideIndex', {index})
      }
    },
    nextSlide() {
      if (this.slideIndex < this.slideCount - 1) {
        this.slideIndex += 1
      }
      this.emitSlideChange(this.slideIndex)
    },
    prevSlide() {
      if (this.slideIndex > 0) {
        this.slideIndex -= 1
      }
      this.emitSlideChange(this.slideIndex)
    },
  },
  created() {
    this.initSocket()
  }
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #212122;
  border-color: #212122;
  font-family: 'Space Grotesk', sans-serif;
}

body,
html {
  overflow: hidden;
}

h3 {
  text-decoration: underline;
  margin-bottom: 2rem;
}

p {
  margin-bottom: 1rem;
}

button,
p,
span {
  font-size: 1rem;
  line-height: 1.3rem;
}

ol {
  padding-left: 2rem;
}

@mixin between {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

@mixin border($pos: bottom) {
  border-#{$pos}: 1px solid #212122;
  padding-#{$pos}: .5rem;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #CECECE;

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 6fr 4fr;
  grid-gap: 1rem;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding: 1rem;
  overflow: hidden;

  #title {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
    border-bottom: 1px solid #212122;
    padding-bottom: .5rem;
    align-self: end;
  }

  #sectionTitle {
    grid-row: 1 / 1;
    grid-column: 2 / 2;
    border-bottom: 1px solid #212122;
    padding-bottom: .5rem;
    align-self: end;

  }

  #slides {
    grid-column: 2 / 2;
    grid-row: 2 / 2;
  }

  #credits {
    grid-row: 3 / 3;
    grid-column: 1 / 1;
    @include border(top);
    align-self: end;
  }

  #buttons, #adminLogin {
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
      background: #EEEEEE;
      border: 1px solid #212122;
    }
  }

}
</style>