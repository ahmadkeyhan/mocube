<template>
  <div :style="{ 'background-image': type.color}" class="typeBanner">
    <h1 class="bannerTitle">
      {{ type.title }}
    </h1>
    <h2 class="bannerSubtitle">
      {{type.subtitle}}
    </h2>
    <img :src="type.avatar" class="bannerAvatar">
  </div>
</template>
<script>
export default {
  props: {
    type: Array
  }
}
</script>
<style>
.typeBanner{
  padding: 8px 8px 0 8px;
  margin-top: 10px;
  border-radius: 8px;
}

.bannerAvatar {
  width: 90%;
}

.bannerTitle {
  font-family: 'Changa';
  color: #f0f0f0;
  font-weight: 800;
  font-size: 2em;
  margin-bottom: 8px;
}


.bannerSubtitle {
  font-family: 'Changa';
  color: #f0f0f0;
  font-size: 1em;
  margin-bottom: -48px;
}
</style>
