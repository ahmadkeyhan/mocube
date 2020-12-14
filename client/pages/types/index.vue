<template>
  <b-container dir="rtl">
    <headernav :isactive="1"></headernav>
    <b-row>
      <b-col cols="12" md="6">
        <div class="titleBox">
          <h1 class="title">
            خلاقیت مثل یک مکعب هشت تا رأس داره:
          </h1>
        </div>
      </b-col>
    </b-row>
    <b-form-row>
      <b-col v-for="type in types" cols="6" md="3">
        <NuxtLink :to="type.link">
          <typecard :type="type"></typecard>
        </NuxtLink>
      </b-col>
    </b-form-row>
  </b-container>
</template>
<script>
import typeService from '@/assets/services/typeService'
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
