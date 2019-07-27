<template>
  <div class="home">
    <Albums />
  </div>
</template>

<script>
// @ is an alias to /src
import Albums from "@/components/Albums.vue";

export default {
  name: "albums",
  components: {
    Albums
  }
};
</script>
