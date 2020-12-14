<template>
  <b-navbar
    class="header"
    sticky
    dir="rtl"
    toggleable="lg">
    <b-navbar-brand id="headerBrand" to="/">مکعب خلاقیت</b-navbar-brand>
    <b-navbar-toggle class="toggler" target="nav-collapse">
      <template #default="{ expanded }">
        <i v-if="expanded" class="material-icons md-24 orange">close</i>
        <i v-else class="material-icons md-24 orange">menu</i>
      </template>
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav id="headerNav">
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

.toggler, .toggler:focus {
  border: 0;
}

#headerBrand {
  font-weight: 600;
  font-size: 1em;
  color: rgba(255,255,255,0.9);
  text-decoration: none;
}

.navbar-nav {
  font-size: .9em;
  color: rgba(255,255,255,0.9);
  float: right;
  text-align: right;
}

.activePage {
    font-weight: bold;
}

.header {
  font-family: 'Changa';
  background-image: linear-gradient(315deg, #263238 40%, #37474F 100%);
  border-radius:0 0 8px 8px;
  padding: 8px;
  min-height: 16vw;
}
</style>
