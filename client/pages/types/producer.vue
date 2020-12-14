<template>
  <b-container dir="rtl">
    <headernav :isactive="1"></headernav>
      <b-row>
        <b-col>
          <typebanner :type="type"></typebanner>
        </b-col>
      </b-row>
      <b-form-row>
        <b-col>
          <div class="producerCard">
            <i class="material-icons md-36 green">fingerprint</i>
            <h2 class="producerTitle">گونه‌ی خلاقیتت رو بیشتر بشناس</h2>
            <i class="material-icons md-36 green">fingerprint</i>
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
      id: '5fadeb960562bb46acd9f73e'
    }
  },
  mounted () {
    this.getTypeById()
  },
  methods: {
    async getTypeById () {
      const response = await typeService.fetchTypeById(this.id)
      this.type = response.data
    }
  }
}
</script>
<style>

.producerCard {
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #4caf50 ;
}

.producerTitle {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.8em;
  display: inline-block;
}

.producerPara {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.9em;
  margin-bottom: 8px;
  float: right;
  text-align: right;
}

</style>
