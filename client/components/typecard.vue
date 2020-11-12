<template>
  <NuxtLink :to="type.link">
    <div :style="{ 'background-color': type.color}" class="typeCard">
      <h2 class="typeTitle">
        {{ type.title }}
      </h2>
      <img :src="type.avatar" class="avatar">
    </div>
  </NuxtLink>
</template>
<script>
export default {
  props: {
    type: Array
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
