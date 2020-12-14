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
          <div class="adventurerCard" :style="{ 'background-image': type.color}">
             <h2 class="adventurerTitle">نقطه قوت خلق:</h2>
             <p class="adventurerPara">
               انرجی بالای خلاقیت، روح کنجکاو و بازیگوش
             </p>
          </div>
        </b-col>
        <b-col>
          <div class="adventurerCard" :style="{ 'background-image': type.color}">
             <h2 class="adventurerTitle">نقطه ضعف خلق:</h2>
             <p class="adventurerPara">
               تعهد به توسعه‌ی مهارت یا پروجه‌ای خاص
             </p>
          </div>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col>
          <b-button block class="adventurerBut" href="">
            گونه‌ی خلاقیتت رو بیشتر بشناس
            <span class="material-icons md-24 orange">info</span>
          </b-button>
        </b-col>
      </b-form-row>
      <b-row>
        <b-col>
          <div class="adventurerTablet" :style="{ 'background-image': type.color}">
            <h2 class="adventurerTitle">ماجراجو:</h2>
            <p class="adventurerPara">
             هیچ گفتنی نیست که تلاش خلاقانه پرشور و کنجکاوی بی پایان ماجراجو می تواند به کجا منجر شود. با سوختن سطح انرژی بالا و اشتیاق بی حد و حصر ، شما به راحتی الهام می گیرید - و بیش از هر چیز مایل به پیروی از جذابیت های خود هستید ، هر جا که شما را ببرند.
            </p>
            <p class="adventurerPara">
              انواع ماجراجو روحیه های خلاقانه پرشور ، گویا ، با استعداد و با توانایی طبیعی در سرگرمی و الهام گرفتن هستند. به عنوان یک ماجراجو ، هرگز راضی نیستید که فقط ایده های خود را ارائه دهید. در عوض ، شما تقریباً یک عمل اجباری دارید که باید به آنها عمل کنید. انرژی فراوان شما در دستیابی به بسیاری از علایق ، سرگرمی ها ، زمینه های تحصیل و فعالیت های هنری به شما دامن می زند. شما یک یادگیرنده سریع هستید ، می توانید مهارت های جدید را انتخاب کرده و پروژه ها و نقش های مختلف را با سهولت نسبی جوراب بازی کنید. یک فرد واقعی در دوره رنسانس ، در طول زندگی و حرفه خود احتمالاً در زمینه های مختلفی تخصص پیدا خواهید کرد.
            </p>
          </div>
        </b-col>
      </b-row>
  </b-container>
</template>
<script>
import typeService from '@/assets/services/typeService'
export default {
  data () {
    return {
      type: [],
      id: '5fadeb490562bb46acd9f73c'
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

.adventurerBut, .adventurerBut:focus, .adventurerBut:hover, .adventurer:visited {
  font-family: "Changa";
  font-size: 0.9em;
  font-weight: 500;
  color: rgba(0,0,0,0.9);
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #FF5722 ;
}

.adventurerCard {
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  min-height: 25vw;
}

.adventurerTablet {
  padding: 16px;
  margin-top: 10px;
  border-radius: 8px;
  height: 130vw;
}

.adventurerTitle {
  font-family: 'Changa';
  color: rgba(255,255,255,0.9);
  font-weight: 500;
  border-bottom: 2px solid rgba(255,255,255,0.9);
  padding: 0 0 4px 4px;
  font-size: 1em;
  float: right;
  text-align: right;
}

.adventurerPara {
  font-family: 'Changa';
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  font-size: 0.8em;
  margin-bottom: 10px;
  float: right;
  text-align: right;
}

</style>
