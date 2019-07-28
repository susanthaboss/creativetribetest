<template>
  <b-container class="text-left">
    <b-row>
      <b-col>
        <h2 v-if="post">{{ post ? post.title : "Loading album title" }}</h2>
        <b-breadcrumb v-if="post" :items="paths"></b-breadcrumb>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <article>{{ post ? post.body : "Loading album content..." }}</article>
        <hr />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 v-if="loadingphotos">Loading photos ....</h4>
        <h4 v-if="photos & (photos.length == 0) & (loadingphotos == false)">
          No photos found
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        class="photo-col"
        col
        cols="12"
        sm="12"
        md="4"
        lg="3"
        xl="2"
        :key="photo.id"
        v-for="photo in photos"
      >
        <b-img
          @click="show(photo.index)"
          thumbnail
          fluid
          :src="photo.thumbnailUrl"
          :alt="photo.title"
        ></b-img>
        <p @click="show(photo.index)" class="photo-caption">
          {{ photo.title }}
        </p>
      </b-col>
    </b-row>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="handleHide"
    ></vue-easy-lightbox>
  </b-container>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      imgs: [], // Img Url , string or Array
      visible: false,
      index: 0, // default
      selectedSort: "oldest",
      sortingOptions: [
        { value: "oldest", text: "Oldes First" },
        { value: "newest", text: "Newest First" }
      ],
      isBusy: false,
      post: null,
      postID: null,
      loadingphotos: false,
      user: null,
      photos: [],
      paths: [
        {
          text: "Home",
          href: "/"
        },
        {
          text: "Albums by ",
          href: "/albumsBy/"
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
    show(indx) {
      this.index = indx; // index of imgList
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
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
          app.paths[1].href =
            app.paths[1].href + app.user.username + "_" + app.user.id;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
          app.$swal(
            "Oops",
            "We failed to load the users. This might due to a network or server error. Please check console for more information",
            "error"
          );
        });
    },

    getPost(postID) {
      this.isBusy = true;
      let app = this;
      axios
        .get("albums/" + postID)
        .then(response => {
          app.post = response.data;
          app.getUser(app.post.userId);
          app.getphotos(app.post.id);
          app.isBusy = false;
          //adjusts the bredcumbs after getting the user details
          app.paths[2].text = app.post.title;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
          app.$swal(
            "Oops",
            "We failed to load the albums. This might due to a network or server error. Please check console for more information",
            "error"
          );
        });
    },

    getphotos(postID) {
      let app = this;
      app.loadingphotos = true;
      axios
        .get("photos?albumId=" + postID)
        .then(response => {
          app.photos = response.data;
          app.imgs = [];

          for (let index = 0; index < app.photos.length; index++) {
            app.imgs.push(app.photos[index].url);
            app.photos[index]["index"] = index;
          }

          app.loadingphotos = false;
        })
        .catch(e => {
          console.error(e);
          app.isBusy = false;
          app.$swal(
            "Oops",
            "We failed to load the photos. This might due to a network or server error. Please check console for more information",
            "error"
          );
        });
    }
  }
};
</script>
<style lang="sass" scoped>
.img-thumbnail
  margin-bottom: 20px
  width: 150px
  height: 150px
.photo-caption
  text-align: center
  font-size: smaller
.photo-col p,img
  cursor: pointer
</style>
