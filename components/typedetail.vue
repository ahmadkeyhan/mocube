<template>
  <b-col cols="12" md="6">
    <div :style="style" class="typeCard">
      <h1 class="typeTitle">
        {{ type.title }}
      </h1>
      <h2 class="typeSubtitle">
        {{ type.subtitle }}
      </h2>
      <img :src="type.avatar" class="avatar">
    </div>
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
    type () {
      let i
      let type
      for (i = 0; i < 8; i++) {
        if (this.creativeType === types[i].title) {
          type = types[i]
        }
      }
      return type
    }
  }
}
</script>
<style>
.typeCard {
  margin: 2%;
  font-family: "Changa";
}

.avatar {
  width: 100%;
}

.typeTitle {
  color: rgba(240,240,240,1);
}
</style>
