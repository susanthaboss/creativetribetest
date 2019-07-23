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
            <b-form-input v-model="filter" placeholder="Search for anything"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">🗑 Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
          <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-show="isBusy">
         <b-alert variant="info" show><b-spinner label="Spinning"></b-spinner> Loading users ...</b-alert>        
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
      <template
        slot="address"
        slot-scope="data"
      >{{data.item.address.suite}}, {{data.item.address.street}}, {{data.item.address.city}}</template>
      <template slot="view" slot-scope="data">
        <div role="group" class="btn-group">
          <router-link class="btn btn-info" :to="'albumsOf/'+ data.item.username + '_' +  data.item.id">📷 Albums</router-link>
          <router-link class="btn btn-success" :to="'photosOf/'+ data.item.username + '_' +  data.item.id">📜 Posts</router-link>
        </div>
      </template>
    </b-table>
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
    this.isBusy = true;
    axios
      .get("users")
      .then(response => {
        this.users = response.data;
        this.totalRows = this.users.length;
        this.isBusy = false;
      })
      .catch(e => {
        console.error(e);
        this.isBusy = false;
      });
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>
