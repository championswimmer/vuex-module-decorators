<template>
  <div class="sponsor">
    <a href="https://codingblocks.com?utm_source=VuexModuleDecorators&amp;utm_medium=vmd&amp;utm_campaign=vmd&amp;utm_term=vmd&amp;utm_content=championswimmer">
      This project is sponsored by 
    </a>
    <img :src="$withBase('/cblogo_big.png')" alt="Coding Blocks">
  </div>
</template>
<style scoped>
.sponsor {
  background-color: #f3f6f8;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  display: inline-block;
  margin: 1em 0 !important;
}
.sponsor * {
  vertical-align: middle;
}
.sponsor a {
  color: #fc4f4f;
}
.sponsor img {
  max-height: 50px;
}
</style>
