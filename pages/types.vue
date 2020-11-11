<template>
  <div>
    <headernav :isactive="1"></headernav>
    <div class="container">
      <b-row>
        <b-col>
          <h1 class="title">
            :گونه های خلاقیت
          </h1>
        </b-col>
      </b-row>
      <b-row dir="rtl" no-gutters>
        <typecard :creativeType="'هنرمند'"></typecard>
        <typecard :creativeType="'متفکر'"></typecard>
        <typecard :creativeType="'ماجراجو'"></typecard>
        <typecard :creativeType="'سازنده'"></typecard>
        <typecard :creativeType="'تهیه کننده'"></typecard>
        <typecard :creativeType="'رویا پرداز'"></typecard>
        <typecard :creativeType="'مبتکر'"></typecard>
        <typecard :creativeType="'بصیر'"></typecard>
      </b-row>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style>
.container {
  font-family: "Changa";
}

.title {
  font-size: 16px;
}

</style>
