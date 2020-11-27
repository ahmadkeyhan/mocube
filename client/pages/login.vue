<template>
  <div>
    <headernav />
    <div class="container">
      <h1>Sign in</h1>
      <authform buttonText="Sign In" :submitForm="signInUser" />
    </div>
  </div>
</template>

<script>
import authform from '@/components/authform'
export default {
  components: {
   authform
  },
  methods: {
   async signInUser(loginInfo){
     try {
       await this.$auth.loginWith('local', {
         data: loginInfo
       })
       console.log("thanks")
     } catch(error) {
      console.log(error.message)
     }
   }
 }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  text-align: center;
}

.title {
  font-family:
    'Changa',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 900;
  font-size: 16px;
  color: #35495e;
}

.gif {
 min-height: 50vh;
 width: 100%;
 background-color: rgba(0,0,0,0.3);
}

.subtitle {
  font-weight: 300;
  font-size: 16px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
