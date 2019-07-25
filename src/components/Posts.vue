<template>
  <b-container class="text-left">
    <b-row>
      <b-col>
        <h2>Posts by {{user ? user.name : '...'}}</h2>
        <b-breadcrumb :items="paths"></b-breadcrumb>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Search" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Search for post title"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">🗑 Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <hr />
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Sort By" class="mb-0">
          <b-input-group>
            <b-form-select v-model="selectedSort" :options="sortingOptions"></b-form-select>
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
          <li :key="post.id" v-for="post in sorted">
            <router-link
              :to="'/post/' + post.title.split(' ').join('_') + '_' + post.id"
            >{{post.title}}</router-link>
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
          text: "Users",
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
  computed: {
    sorted() {
      let retval;
      let app = this;
      switch (app.selectedSort) {
        case "oldest":
          retval = app.filterClient.sort(function(a, b) {
            return a.id > b.id;
          });
          break;
        case "newest":
          retval = app.filterClient
            .sort((a, b) => (a.id < b.id ? 1 : b.id > a.id ? -1 : 0))
            .reverse();
          break;
        case "alphaasc":
          retval = app.filterClient.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "alphadec":
          retval = app.filterClient
            .sort((a, b) => a.title.localeCompare(b.title))
            .reverse();
          break;
        default:
          retval = app.filterClient;
          break;
      }

      return retval;
    },
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
    }
  },

  methods: {
    getUser(userID) {
      this.isBusy = true;
      axios
        .get("users/" + userID)
        .then(response => {
          this.user = response.data;
          this.isBusy = false;
          //adjusts the bredcumbs after getting the user details
          this.paths[1].text = this.paths[1].text + this.user.name;
        })
        .catch(e => {
          console.error(e);
          this.isBusy = false;
        });
    },
    getPosts(userID) {
      this.isBusy = true;
      axios
        .get("posts?userId=" + userID)
        .then(response => {
          this.posts = response.data;
          this.isBusy = false;
        })
        .catch(e => {
          console.error(e);
          this.isBusy = false;
        });
    }
  }
};
</script>
