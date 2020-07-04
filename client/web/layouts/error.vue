<template>
  <div class="error">
    <div class="content">
      <img :src="errorImg" alt />
      <p>{{errMsg}}</p>
    </div>
    <a href="/">返回首页</a>
  </div>
</template>
<style lang="css">
.error {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error .content {
  height: 300px;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.error img {
  width: 160px;
  height: 160px;
  margin-right: 20px;
  /* background: #ccc; */
}
.error p {
  display: inline-block;
  font-size: 20px;
  color: #333;
}
.error a:hover {
  text-decoration: underline;
}
</style>
<script>
export default {
  data() {
    return {
      errMsg: "找不到页面了~",
      errorImg: require("../assets/img/ic_404.svg")
    };
  },
  asyncData() {
    return {
      // errorImg: require("../assets/img/ic_404.svg")
    };
  }
};
</script>
