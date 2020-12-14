<template>
  <b-container dir="rtl">
    <headernav :isactive="1"></headernav>
    <b-row>
      <b-col  class="titleBox">
        <h1 class="title">
          {{ message }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <typebanner :type="type"></typebanner>
      </b-col>
    </b-row>
    <b-form-row>
      <b-col>
        <div class="artistCard">
          <i class="material-icons md-36 red">fingerprint</i>
          <h2 class="artistTitle">گونه‌ی خلاقیتت رو بیشتر بشناس</h2>
          <i class="material-icons md-36 red">fingerprint</i>
        </div>
      </b-col>
    </b-form-row>
  </b-container>
</template>
<script>
import typeService from '@/assets/services/typeService'
export default {
  data () {
    return {
      type: [],
      id: '5fadeacf0562bb46acd9f73a',
      test: ""
    }
  },
  mounted () {
    this.getTypeById(),
    this.testOrNot()
  },
  methods: {
    async getTypeById () {
      const response = await typeService.fetchTypeById(this.id)
      this.type = response.data
    },
    testOrNot () {
      if (this.$route.params.id === 1) {
        this.message = "yes"
      }
    }
  }
}
</script>
<style>

.artistCard {
  padding:8px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #f44336 ;
}

.artistTitle {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.8em;
  display: inline-block;
}

.artistPara {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.9em;
  margin-bottom: 8px;
  float: right;
  text-align: right;
}

</style>
