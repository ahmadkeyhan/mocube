<template>
  <b-row dir="rtl" no-gutters>
    <b-col cols="12" md="6">
      <div :style="{ 'background-color': type.color}" class="typeCard">
        <h1 class="typeTitle">
          {{ type.title }}
        </h1>
        <h2 class="typeSubtitle">
          {{ type.subtitle }}
        </h2>
        <img :src="type.avatar" class="avatar">
      </div>
    </b-col>
  </b-row>
</template>
<script>
export default {
  data () {
    return {
      type: []
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
