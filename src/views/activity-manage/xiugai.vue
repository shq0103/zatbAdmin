<template>
  <ArticlePublic :is-edit="true"/>
</template>

<script>
import ArticlePublic from "./components/ActivityPublic";

export default {
  name: "EditForm",
  components: { ArticlePublic }
};
</script>

