<template>
    <div dir="rtl" :style="{ 'background-image': type.color}" class="typeCard">
      <h2 class="typeTitle">
        {{ type.title }}
      </h2>
      <img :src="type.avatar" class="avatar">
    </div>
</template>
<script>
export default {
  props: {
    type: Object
  }
}
</script>
<style>
.typeCard {
  font-family: "Changa";
  padding-top: 8px;
  margin-top: 10px;
  max-height: 45vw;
  border-radius: 8px;
}

.avatar {
  width: 90%;
}

.typeTitle {
  color: rgba(240,240,240,1);
  font-size: 16px;
  margin-bottom: -8px;
}
</style>
