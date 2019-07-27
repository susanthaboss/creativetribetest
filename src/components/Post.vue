<template>
  <b-container class="text-left">
    <b-row>
      <b-col>
        <h2 v-if="post">{{ post ? post.title : "Loading post title" }}</h2>
        <b-breadcrumb v-if="post" :items="paths"></b-breadcrumb>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <article>{{ post ? post.body : "Loading post content..." }}</article>
        <hr />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 v-if="comments.length > 0">Comments</h4>
        <h4 v-if="loadingComments">Loading Comments ....</h4>
        <h4
          v-if="comments & (comments.length == 0) & (loadingComments == false)"
        ></h4>
      </b-col>
      <b-col>
        <b-form-group label-cols-sm="3" label="Sort By" class="mb-0">
          <b-input-group>
            <b-form-select
              @change="comments = comments.reverse()"
              v-model="selectedSort"
              :options="sortingOptions"
            ></b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row :key="comment.id" v-for="comment in comments">
      <b-col>
        <hr />
        <p>
          By
          <b-link :href="'mailto:' + comment.email">{{ comment.name }}</b-link>
        </p>
        <p class="comment-box">{{ comment.body }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      selectedSort: "oldest",
      sortingOptions: [
        { value: "oldest", text: "Oldes First" },
        { value: "newest", text: "Newest First" }
      ],
      isBusy: false,
      post: null,
      postID: null,
      loadingComments: false,
      user: null,
      comments: [],
      paths: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Posts by ",
          href: "/postsBy/"
        },
        {
          text: "loading post title...",
          active: true
        }
      ]
    };
  },
  mounted() {
    let paras = this.$route.params.postname.split("_");
    this.postID = paras[paras.length - 1];

    this.getPost(this.postID);
  },
  methods: {
    getUser(userID) {
      let app = this;
      app.isBusy = true;
      axios
        .get("users/" + userID)
        .then(response => {
          app.user = response.data;
          app.isBusy = false;
          //adjusts the bredcumbs after getting the user details
          app.paths[1].text = app.paths[1].text + app.user.name;
          app.paths[1].href =
            app.paths[1].href + app.user.username + "_" + app.user.id;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
        });
    },

    getPost(postID) {
      this.isBusy = true;
      let app = this;
      axios
        .get("posts/" + postID)
        .then(response => {
          app.post = response.data;
          app.getUser(app.post.userId);
          app.getComments(app.post.id);
          app.isBusy = false;
          //adjusts the bredcumbs after getting the user details
          app.paths[2].text = app.post.title;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
        });
    },

    getComments(postID) {
      let app = this;
      app.loadingComments = true;
      axios
        .get("comments?postId=" + postID)
        .then(response => {
          app.comments = response.data;
          app.loadingComments = false;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
        });
    }
  }
};
</script>
<style lang="sass" scoped>
.comment-box
  margin: 0 20px
.comment-box, article
  white-space: pre
</style>
