<template>
  <b-col cols="6" md="3">
    <NuxtLink :to="typePage">
      <div :style="style" class="typeCard">
        <h2 class="typeTitle">
          {{ creativeType }}
        </h2>
        <img :src="avatar" class="avatar">
      </div>
    </NuxtLink>
  </b-col>
</template>
<script>
import typesData from '../static/types.json'
const types = typesData
export default {
  props: {
    creativeType: String
  },
  computed: {
    style () {
      let i
      let background
      for (i = 0; i < 8; i++) {
        if (this.creativeType === types[i].title) {
          background = 'background-color: ' + types[i].color
        }
      }
      return background
    },
    avatar () {
      let i
      let avatarSrc
      for (i = 0; i < 8; i++) {
        if (this.creativeType === types[i].title) {
          avatarSrc = types[i].avatar
        }
      }
      return avatarSrc
    },
    typePage () {
      let i
      let typeRoute
      for (i = 0; i < 8; i++) {
        if (this.creativeType === types[i].title) {
          typeRoute = types[i].link
        }
      }
      return typeRoute
    }
  }
}
</script>
<style>
.typeCard {
  margin: 2%;
}

.avatar {
  width: 100%;
}

.typeTitle {
  color: rgba(240,240,240,1);
}
</style>
