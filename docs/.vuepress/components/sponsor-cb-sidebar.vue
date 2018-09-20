<template>
  <div class="sponsor">
    <h5 align="center">Sponsors</h5>
    <a href="https://codingblocks.com?utm_source=VuexModuleDecorators&amp;utm_medium=vmd&amp;utm_campaign=vmd&amp;utm_term=vmd&amp;utm_content=championswimmer">
      <img :src="$withBase('/cblogo_big.png')" alt="Coding Blocks">
    </a>
  </div>
</template>
<style scoped>
.sponsor {
  background-color: #f3f6f8;
  padding: 0.3em;
  border-radius: 4px;
  display: inline-block;
  margin: 1em 0 !important;
  position: fixed;
  top: 60px;
  right: 10px;
}
.sponsor h5 {
  margin: 4px;
  margin-bottom: 20px;
}
.sponsor * {
  vertical-align: middle;
}
.sponsor img {
  max-height: 50px;
}
</style>
