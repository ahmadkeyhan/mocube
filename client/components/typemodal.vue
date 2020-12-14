<template>
    <b-modal
      hide-footer
      hide-header
      centered
      dir="rtl"
      :id="type.title"
      content-class="modalBody">
      <div  :style="{ 'background-image': type.color}" class="typeModal">
        <h2 class="modalTitle">
          پیشنهاد میدم اول تست بدی، بعد گونه ها رو ببینی
        </h2>

        <b-row>
          <b-col>
            <img :src="type.avatar" class="modalAvatar">
          </b-col>
          <b-col>
            <b-button variant="light" class="modalMainBut" size="lg" to="/test">
              تست بده!
              <i class="material-icons md-24">create</i>
            </b-button>
            <b-button variant="outline-light" class="modalSubBut" size="lg" :to="type.link">
              برو تو گونه!
              <i class="material-icons md-24">face</i>
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
</template>
<script>
export default {
  props: {
    type: Object
  }
}
</script>
<style>
.typeModal {
  padding: 16px;
  margin: 0 8px;
  border-radius: 8px;
  font-family: "Changa";
}

.modalBody {

  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 1);
}

.modalAvatar {
  width: 90%;
  border-radius: 50%;
  border: 2px solid white;
  margin-top: 10px;
}

.modalTitle {
  color: #f0f0f0;
  font-size: 16px;
  float: right;
  text-align: right;
}

.modalMainBut, .modalMainBut:focus, .modalMainBut:hover {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  background-color: rgba(240,240,240,1);
  margin-top: 10px;
  padding: 10px 8px;
  width: 100%;
}

.modalSubBut, .modalSubBut:focus, .modaSubBut:hover {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: 2px solid rgba(240,240,240,1);
  margin-top: 10px;
  padding: 10px 8px;
  width: 100%;
}

.modal-body {
  padding: 0;
}

</style>
