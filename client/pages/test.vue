<template>
  <div>
    <headernav :isactive="2"></headernav>
    <div class="container">
      <b-row>
        <b-col class="question">
          <h2>{{ questions[index].question }}</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="answer">
          <b-button @click="firstAnswer">{{ questions[index].answer1 }}</b-button>
        </b-col>
        <b-col class="answer">
          <b-button @click="secondAnswer">{{ questions[index].answer2 }}</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import questionsData from '../static/questions.json'
const questions = questionsData
export default {
  data () {
    return {
      questions,
      index: 0,
      score: 555,
      artist: [600, 602, 604, 620, 622, 624, 640, 642, 644, 800, 802, 804, 820, 822, 824, 840, 842, 844, 1000, 1002, 1004, 1020, 1022, 1024, 1040, 1042, 1044],
      thinker: [666, 668, 670, 686, 688, 690, 706, 708, 710, 866, 868, 870, 886, 888, 890, 906, 908, 910, 1066, 1068, 1070, 1086, 1088, 1090, 1106, 1108, 1110],
      adventurer: [0, 2, 4, 20, 22, 24, 40, 42, 44, 200, 202, 204, 220, 222, 224, 240, 242, 244, 400, 402, 404, 420, 422, 424, 440, 442, 444],
      maker: [660, 662, 664, 680, 682, 684, 700, 702, 704, 860, 862, 864, 880, 882, 884, 900, 902, 904, 1060, 1062, 1064, 1080, 1082, 1084, 1100, 1102, 1104],
      producer: [60, 62, 64, 80, 82, 84, 100, 102, 104, 260, 262, 264, 280, 282, 284, 300, 302, 304, 460, 462, 464, 480, 482, 484, 500, 502, 504],
      dreamer: [606, 608, 610, 626, 628, 630, 646, 648, 650, 806, 808, 810, 826, 828, 830, 846, 848, 850, 1006, 1008, 1010, 1026, 1028, 1030, 1046, 1048, 1050],
      innovator: [66, 68, 70, 86, 88, 90, 106, 108, 110, 266, 268, 270, 286, 288, 290, 306, 308, 310, 466, 468, 470, 486, 488, 490, 506, 508, 510],
      visionary: [6, 8, 10, 26, 28, 30, 46, 48, 50, 206, 208, 210, 226, 228, 230, 246, 248, 250, 406, 408, 410, 426, 428, 430, 446, 448, 450]
    }
  },
  methods: {
    firstAnswer () {
      if (this.index < 14) {
        this.score += this.questions[this.index].factor
        this.index += 1
      } else {
        this.score += this.questions[this.index].factor
        if (this.artist.includes(this.score)) {
          this.$router.push('/artist')
        } else if (this.thinker.includes(this.score)) {
          this.$router.push('/thinker')
        } else if (this.adventurer.includes(this.score)) {
          this.$router.push('/adventurer')
        } else if (this.maker.includes(this.score)) {
          this.$router.push('/maker')
        } else if (this.producer.includes(this.score)) {
          this.$router.push('/producer')
        } else if (this.dreamer.includes(this.score)) {
          this.$router.push('/dreamer')
        } else if (this.innovator.includes(this.score)) {
          this.$router.push('/innovator')
        } else {
          this.$router.push('/visionary')
        }
      }
    },
    secondAnswer () {
      if (this.index < 14) {
        this.score -= this.questions[this.index].factor
        this.index += 1
      } else {
        this.score -= this.questions[this.index].factor
        if (this.artist.includes(this.score)) {
          this.$router.push('/artist')
        } else if (this.thinker.includes(this.score)) {
          this.$router.push('/thinker')
        } else if (this.adventurer.includes(this.score)) {
          this.$router.push('/adventurer')
        } else if (this.maker.includes(this.score)) {
          this.$router.push('/maker')
        } else if (this.producer.includes(this.score)) {
          this.$router.push('/producer')
        } else if (this.dreamer.includes(this.score)) {
          this.$router.push('/dreamer')
        } else if (this.innovator.includes(this.score)) {
          this.$router.push('/innovator')
        } else {
          this.$router.push('/visionary')
        }
      }
    }
  }
}
</script>
<style>
.container {
  font-family: "Changa";
}

.answer {

}
</style>
