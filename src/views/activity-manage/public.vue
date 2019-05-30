<template>
  <ActivityPublic :is-edit="false"/>
</template>

<script>
import ActivityPublic from "./components/ActivityPublic";

export default {
  name: "CreateForm",
  components: { ActivityPublic }
};
</script>

