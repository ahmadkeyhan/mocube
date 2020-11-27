<template>
  <b-navbar
    class="header"
    dir="rtl"
    toggleable="lg"
    type="dark"
    variant="dark">
    <b-navbar-brand to="/">گونه های خلاقیت</b-navbar-brand>
    <div class="" v-if="$auth.loggedIn">
      <p> {{ $auth.user }} </p>
      <b-button
        @click="$auth.logout()"
        class="button--grey"
      >
        لاگ آوت
      </b-button>
    </div>
    <div class="" v-else>
      <NuxtLink
        to="/signin"
        class="button--grey"
      >
        لاگ این
      </NuxtLink>
      <NuxtLink
        to="/signup"
        class="button--grey"
      >
        رجیستر
      </NuxtLink>
    </div>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav id="asd">
        <b-nav-item :class="{activePage: isactive === 1}" to="/types">گونه ها</b-nav-item>
        <b-nav-item :class="{activePage: isactive === 2}" to="/test">تست مکعب خلاقیت</b-nav-item>
        <b-nav-item :class="{activePage: isactive === 3}" to="/about">درباره تست</b-nav-item>
        <b-nav-item :class="{activePage: isactive === 4}" to="/creativity">درباره خلاقیت</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  props: {
    isactive: Number
  }
}
</script>
<style>
.activePage {
    font-weight: bold;
}

.header {
  font-family: 'Changa';
}

#asd {
  float: right;
  text-align: right;
}
</style>
