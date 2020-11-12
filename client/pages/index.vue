<template>
  <div>
    <headernav />
    <div class="container">
      <div>
        <h1 class="title">
          :خلاقیت مثل یک مکعب هشت تا رأس داره
        </h1>
        <div class="col gif">
        </div>
        <h2 class="subtitle">
          حدس میزنی روی کدوم رأس ایستادی؟
        </h2>
        <div class="links">
          <NuxtLink
            to="/test"
            class="button--grey"
          >
            !تست بده
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
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
