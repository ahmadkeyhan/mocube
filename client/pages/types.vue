<template>
  <div>
    <headernav :isactive="1"></headernav>
    <div class="container">
      <b-row>
        <b-col v-for="type in types" cols="6" md="3">
          <typecard :type="type"></typecard>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import typeService from '../assets/services/typeService'
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
