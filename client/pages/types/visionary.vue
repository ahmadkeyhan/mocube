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
          <div class="visionaryCard">
            <i class="material-icons md-36 yellow">fingerprint</i>
            <h2 class="visionaryTitle">گونه‌ی خلاقیتت رو بیشتر بشناس</h2>
            <i class="material-icons md-36 yellow">fingerprint</i>
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
      id: '5fadebe50562bb46acd9f741'
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

.visionaryCard {
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #ffeb3b ;
}

.visionaryTitle {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.8em;
  display: inline-block;
}

.visionaryPara {
  font-family: 'Changa';
  color: #263238;
  font-size: 0.9em;
  margin-bottom: 8px;
  float: right;
  text-align: right;
}

</style>
