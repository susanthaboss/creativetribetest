<template>
  <b-container class="text-left">
    <b-row>
      <b-col>
        <h2 v-if="user">Posts by {{ user ? user.name : "..." }}</h2>
        <b-breadcrumb v-if="user" :items="paths"></b-breadcrumb>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Search" class="mb-0">
          <b-input-group>
            <b-form-input
              v-model="filter"
              placeholder="Search for the post title"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >🗑 Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <hr />
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort By" class="mb-0">
          <b-input-group>
            <b-form-select
              @change="filterPosts()"
              v-model="selectedSort"
              :options="sortingOptions"
            ></b-form-select>
          </b-input-group>
        </b-form-group>
        <hr />
      </b-col>
    </b-row>
    <b-row>
      <b-col v-show="isBusy">
        <b-alert variant="info" show>
          <b-spinner label="Spinning"></b-spinner> Loading posts ...
        </b-alert>
      </b-col>
      <b-col v-show="posts.length == 0 && !isBusy">
        <b-alert variant="warning" show>No posts found</b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ol>
          <li :key="post.id" v-for="post in filteredPosts">
            <router-link
              :to="'/post/' + post.title.split(' ').join('_') + '_' + post.id"
              >{{ post.title }}</router-link
            >
          </li>
        </ol>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from "axios";

export default {
  data: function() {
    return {
      filter: null,
      user: null,
      userName: null,
      userID: null,
      posts: [],
      filteredPosts: [],
      isBusy: false,
      sortingOptions: [
        { value: "oldest", text: "Oldes First" },
        { value: "newest", text: "Newest First" },
        { value: "alphaasc", text: "Title alphabetically ascending" },
        { value: "alphadec", text: "Title alphabetically decending" }
      ],
      selectedSort: "oldest",
      paths: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Posts by ",
          active: true
        }
      ]
    };
  },

  mounted() {
    let paras = this.$route.params.userName.split("_");
    this.userID = paras[paras.length - 1];
    this.userName = this.$route.params.userName.replace("_" + this.userID, "");

    this.getUser(this.userID);
    this.getPosts(this.userID);
  },
  computed: {},
  watch: {
    // on change and keypress won't work as user type on text box
    // so had to use a watcher
    filter: function() {
      this.filterPosts();
    }
  },
  methods: {
    filterClient() {
      let app = this;
      if (app.posts) {
        return app.posts.filter(function(post) {
          if (app.filter) {
            return post.title.toLowerCase().includes(app.filter.toLowerCase());
          } else {
            return true;
          }
        });
      } else {
        return [];
      }
    },
    filterPosts() {
      let retval;
      let app = this;
      switch (app.selectedSort) {
        case "oldest":
          retval = app.filterClient().sort(function(a, b) {
            return a.id > b.id;
          });
          break;
        case "newest":
          retval = app.filterClient().sort(function(a, b) {
            return a.id < b.id;
          });
          break;
        case "alphaasc":
          retval = app
            .filterClient()
            .sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "alphadec":
          retval = app
            .filterClient()
            .sort((a, b) => a.title.localeCompare(b.title))
            .reverse();
          break;
        default:
          retval = app.filterClient();
          break;
      }

      app.filteredPosts = retval;
    },
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
        })
        .catch(function() {
          this.isBusy = false;

          this.$swal(
            "Oops",
            "We failed to load the users. This might due to a network or server error. Please check console for more information",
            "error"
          );
        });
    },
    getPosts(userID) {
      let app = this;
      app.isBusy = true;
      axios
        .get("posts?userId=" + userID)
        .then(response => {
          app.posts = response.data;
          app.filterPosts();
          app.isBusy = false;
        })
        .catch(function() {
          app.isBusy = false;

          app.$swal(
            "Oops",
            "We failed to load the posts. This might due to a network or server error. Please check console for more information",
            "error"
          );
        });
    }
  }
};
</script>
