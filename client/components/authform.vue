<template>
  <b-form>
    <b-form-group
      id="input-group-1"
      label="username"
      label-for="input-1"
    >
      <b-form-input
        id="input-1"
        v-model="user.username"
        required
      ></b-form-input>
    </b-form-group>
    <b-form-group
      id="input-group-2"
      label="email"
      label-for="input-2"
      v-if="hasName"
    >
      <b-form-input
        id="input-2"
        v-model="user.email"
        type="email"
        required
      ></b-form-input>
    </b-form-group>
    <b-form-group
      id="input-group-3"
      label="password"
      label-for="input-3"
    >
      <b-form-input
        id="input-3"
        v-model="user.password"
        type="password"
        required
      ></b-form-input>
    </b-form-group>
    <b-button @click="submitForm(user)">{{ buttonText }}</b-button>
  </b-form>
</template>

<script>
  export default {
    data() {
      return {
        hasName: false,
        user: {
          username: '',
          password: ''
        }
      }
    },
    props: ["submitForm", "buttonText", "hasName"]
  }
</script>

<style>

</style>
