<template>
  <div id="painting">
    <transition name="fade">
      <img
        id="random"
        v-if="!reveal"
        :src="randomImage.url"
        @click="setExpand(true, randomIndex)"
      />

      <div v-else id="revealed">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img.url"
          @click="setExpand(true, index)"
        />
      </div>
    </transition>

    <transition name="fade">
      <div id="expand" v-if="expand" @click="setExpand()">
        <img :src="expandedImage.url" alt="" />

        <div v-if="reveal" id="versionInfo">
          <span id="version">Version N°{{ expandIndex + 1 }}</span>
          <span id="date">Painted in {{ expandedImage.date }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'Painting',
    props: {
      reveal: {
        type: Boolean,
        default: false,
      },
      images: Array,
    },
    data() {
      return {
        randomIndex: Math.round(Math.random() * 4),
        expand: false,
        expandIndex: 0,
      };
    },
    computed: {
      randomImage() {
        return this.images[this.randomIndex];
      },
      expandedImage() {
        return this.images[this.expandIndex];
      },
    },
    methods: {
      setExpand(bool, i) {
        if (i !== undefined || i !== null) {
          this.expandIndex = i;
        }
        this.expand = bool;
      },
    },
  };
</script>
<style lang="scss">
  @mixin scrollbar-hide {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  #painting {
    grid-column: 1 / 1;
    grid-row: 2 / 2;
    max-height: 100%;
    overflow-y: auto;

    #revealed {
      transition-duration: 0.6s !important;
      transition-delay: 0.6s;
      height: min-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      img:not(:last-child) {
        margin-bottom: var(--spacing);
      }
    }

    #random,
    #revealed img {
      width: 100%;
      cursor: zoom-in;
      transition-duration: 0.3s;

      &:hover {
        transform: scale(0.97);
      }
    }

    #expand {
      position: absolute;
      background-color: #cecece;
      left: 0;
      top: 0;
      height: 100vh;
      width: 100vw;
      padding: 1rem;
      transition-duration: 0.6s;
      display: grid;
      grid-template-rows: 1fr auto;
      grid-gap: 1rem;

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        object-position: center center;
        transition-duration: 0s;
        cursor: zoom-out;
      }

      #versionInfo {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #212122;
        padding-top: 0.5rem;

        #version {
          text-decoration: underline;
        }
      }
    }
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @media only screen and (min-width: 700px) {
    #painting {
      @include scrollbar-hide;
    }
  }

  @media only screen and (max-width: 700px) {
    #painting {
      grid-column: 1 / -1;
      grid-row: 2 / 2;
    }
  }
</style>
