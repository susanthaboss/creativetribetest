<template>
  <div class="home">
    <Post />
  </div>
</template>

<script>
// @ is an alias to /src
import Post from "@/components/Post.vue";

export default {
  name: "post",
  components: {
    Post
  }
};
</script>
