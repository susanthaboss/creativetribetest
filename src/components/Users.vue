<template>
  <b-container class="text-left">
    <b-row>
      <b-col>
        <h2>Available Users</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Search" class="mb-0">
          <b-input-group>
            <b-form-input
              v-model="filter"
              placeholder="Search for anything"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >🗑 Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="users Per page" class="mb-0">
          <b-form-select
            v-model="perPage"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-show="isBusy">
        <b-alert variant="info" show>
          <b-spinner label="Spinning"></b-spinner>Loading users ...
        </b-alert>
      </b-col>
      <b-col v-show="users.length == 0 && !isBusy">
        <b-alert variant="warning" show>No users found</b-alert>
      </b-col>
    </b-row>
    <b-table
      v-show="users"
      :busy.sync="isBusy"
      striped
      hover
      bordered
      small
      responsive
      :items="users"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      @filtered="onFiltered"
    >
      <template slot="name" slot-scope="data">
        <b-link v-on:click.stop.prevent="showUserDetails(data.item)" href="#">
          {{ data.item.name }}
        </b-link>
      </template>
      <template slot="address" slot-scope="data">
        {{ data.item.address.suite }}, {{ data.item.address.street }},
        {{ data.item.address.city }}
      </template>
      <template slot="view" slot-scope="data">
        <div role="group" class="btn-group">
          <router-link
            class="btn btn-info"
            :to="'albumsBy/' + data.item.username + '_' + data.item.id"
            >📷 Albums</router-link
          >
          <router-link
            class="btn btn-success"
            :to="'postsBy/' + data.item.username + '_' + data.item.id"
            >📜 Posts</router-link
          >
        </div>
      </template>
    </b-table>

    <b-modal size="lg" id="modalUser" title="User Details" ok-only>
      <table
        v-if="currentUser"
        class="table table-striped table-hover table-bordered"
      >
        <tr>
          <th>ID</th>
          <td>{{ currentUser.id }}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{{ currentUser.name }}</td>
        </tr>
        <tr>
          <th>User Name</th>
          <td>{{ currentUser.username }}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>
            {{ currentUser.address.suite }}, {{ currentUser.address.street }},
            {{ currentUser.address.city }}, {{ currentUser.address.zipcode }}
          </td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>
            <a :href="'tel:' + currentUser.phone">{{ currentUser.phone }}</a>
          </td>
        </tr>
        <tr>
          <th>eMail</th>
          <td>
            <a :href="'mailto:' + currentUser.email">{{ currentUser.email }}</a>
          </td>
        </tr>
        <tr>
          <th colspan="2">Company</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>{{ currentUser.company.name }}</td>
        </tr>
        <tr>
          <td>Catch Phrase</td>
          <td>{{ currentUser.company.catchPhrase }}</td>
        </tr>
        <tr>
          <td>BS</td>
          <td>{{ currentUser.company.bs }}</td>
        </tr>
      </table>
    </b-modal>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
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
      currentUser: null,
      currentPage: 1,
      perPage: 5,
      users: [],
      isBusy: false,
      pageOptions: [5, 10, 15],
      totalRows: 1,
      fields: [
        {
          key: "username",
          sortable: true
        },
        {
          key: "name",
          sortable: true
        },
        {
          key: "website",
          sortable: true
        },
        {
          key: "company.name",
          label: "Company",
          sortable: true
        },
        {
          key: "address"
        },
        {
          key: "view"
        }
      ]
    };
  },
  mounted() {
    let app = this;
    app.isBusy = true;
    axios
      .get("users")
      .then(response => {
        app.users = response.data;
        app.totalRows = app.users.length;
        app.isBusy = false;
      })
      .catch(e => {
        console.log(e);
        app.isBusy = false;
        app.$swal(
          "Oops",
          "We failed to load the users. This might due to a network or server error. Please check console for more information",
          "error"
        );
      });
  },
  methods: {
    showUserDetails(user) {
      this.currentUser = user;
      this.$bvModal.show("modalUser");
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>
