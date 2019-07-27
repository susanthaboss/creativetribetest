<template>
  <div class="home">
    <Album />
  </div>
</template>

<script>
// @ is an alias to /src
import Album from "@/components/Album.vue";

export default {
  name: "album",
  components: {
    Album
  }
};
</script>