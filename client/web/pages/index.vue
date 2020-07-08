<template>
  <div class="container">
    <div class="article-list">
        <div class="article-list-item">
            <nuxt-link to="/">
                <div class="left">
                    <img src="" alt="">
                </div>
                <div class="right">
                    <div class="title"></div>
                    <div class="desc"></div>
                </div>
            </nuxt-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
