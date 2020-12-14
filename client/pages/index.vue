<template>
    <b-container dir="rtl">
      <headernav />
      <b-row>
        <b-col cols="12" md="6">
          <div class="titleBox">
            <h1 class="title">
              خلاقیت مثل یک مکعب هشت تا رأس داره:
            </h1>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="type in types">
          <typemodal :type="type"></typemodal>
        </b-col>
      </b-row>
      <b-form-row>
        <b-col cols="6" md="3">
          <b-carousel
            v-if="types && types.length"
            id="carousel"
            :interval="3000"
            fade
          >
            <b-carousel-slide v-for="type in types.slice(0,2)">
              <template #img>
                <NuxtLink to="" v-b-modal="type.title">
                  <typecard :type="type"></typecard>
                </NuxtLink>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
        <b-col cols="6" md="3">
          <b-carousel
            v-if="types && types.length"
            id="carousel"
            :interval="3000"
            fade
          >
            <b-carousel-slide v-for="type in types.slice(2,4)">
              <template #img>
                <NuxtLink to="" v-b-modal="type.title">
                  <typecard :type="type"></typecard>
                </NuxtLink>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
        <b-col cols="6" md="3">
          <b-carousel
            v-if="types && types.length"
            id="carousel"
            :interval="3000"
            fade
          >
            <b-carousel-slide v-for="type in types.slice(4,6)">
              <template #img>
                <NuxtLink to="" v-b-modal="type.title">
                  <typecard :type="type"></typecard>
                </NuxtLink>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
        <b-col cols="6" md="3">
          <b-carousel
            v-if="types && types.length"
            id="carousel"
            :interval="3000"
            fade
          >
            <b-carousel-slide v-for="type in types.slice(6)">
              <template #img>
                <NuxtLink to="" v-b-modal="type.title">
                  <typecard :type="type"></typecard>
                </NuxtLink>
              </template>
            </b-carousel-slide>
          </b-carousel>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col cols="8" md="4">
          <div class="subtitleBox">
            <h2 class="subtitle">
              حدس میزنی روی کدوم رأس ایستادی؟
            </h2>
          </div>
        </b-col>
        <b-col cols="4" md="2">
            <b-button variant="light" class="mainBut" size="lg" to="/test">
              تست بده!
              <span class="material-icons md-18 orange">create</span>
            </b-button>
        </b-col>
      </b-form-row>
    </b-container>
</template>

<script>
import typeService from '../assets/services/typeService'
import gsap from "gsap"
export default {
  data () {
    return {
      types: []
    }
  },
  mounted () {
    this.getTypes()

  },
  methods: {
    async getTypes () {
      const response = await typeService.fetchTypes()
      this.types = response.data
    }
  }
}
</script>

<style>
.container {
  padding-left: 16px;
  padding-right: 16px;
  justify-content: center;
  text-align: center;
}

.titleBox {
  padding: 8px;
  max-height: 16vw;
  margin-top: 10px;
}

.subtitleBox {
  margin-top: 16px;
  padding: 8px 0;
}

.title {
    font-family: 'Changa';
    font-weight: 800;
    font-size: 1em;
    color: #35495e;
    margin-bottom: 0;
}

.subtitle {
  font-family: 'Changa';
  font-weight: 500;
  font-size: 12px;
  color: #526488;
  word-spacing: 0;
  margin-bottom: 0;
}

.mainBut, .mainBut:focus, .mainBut:hover, .mainBut:visited {
  font-family: "Changa";
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  color: rgba(255,255,255,0.9);
  background-color: 263238;
  background-image: linear-gradient(315deg, #263238 40%, #37474F 100%);
  margin-top: 10px;
  padding: 10px 8px;
  width: 100%;
}


</style>
