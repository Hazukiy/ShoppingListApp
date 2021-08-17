<template>
  <div class="container">
    <Header />
    <Error v-if="errorRaised" :errorMessage="errorMessage" :errorPriority="errorPriority" />
    <TodaysList v-if="hasListToday"/>
    <CreateList v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import TodaysList from '@/components/TodaysList.vue';
import CreateList from '@/components/CreateList.vue';
import Error from '@/components/ErrorModal.vue';

export default {
  name: "Home",
  data() {
    return {
      hasListToday: false,
      errorRaised: false,
      errorMessage: "",
      errorPriority: 0
    }
  },
  components: {
    Header,
    Error,
    TodaysList,
    CreateList
  },
  mounted() {
    // Make a call to see if there's a list that exists for today
    fetch('http://86.162.193.13:8081/hasListToday')
    .then(res => res.json())
    .then(data => { this.hasListToday = data; })
    .catch(err => console.log(err)) // Need to do something about this lol

    // Create a new custom event listener
    this.$el.addEventListener('raiseError', e => {
      this.errorMessage = e.detail.errorMessage;
      this.errorPriority = e.detail.priority;
      this.errorRaised = true;

      // Add a timer to slide up the error
      setTimeout(function() {
        this.errorRaised = false;
      }.bind(this), 6000);

      console.log(`Error received: ${e.detail.errorMessage} with priority ${e.detail.priority}`)
    });
  }
};
</script>

<style>
  html, body {
    background-color: #1e1e1e;
    overflow-x: hidden;
  }

  footer {
    padding: 10px;
    background-color: #2b2b2b;
    border-top: 1px solid #111;
  }

    /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #111111; 
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #797979; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }

  .list-container {
    margin-bottom: 80px;
  }

  .shopping-item {
    width: 100%;
    height: 120px;
    background-color: #1e1e1e;
    color: #e1e1e1;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #363636;
  }

  .shopping-item:hover {
    border: 1px solid #747474;
  }

  .shopping-image {
    height: 100px;
    width: 100px;
    display: flex;
    flex-direction: row;
    float: left;
    position: relative;
  }

  .shopping-details {
    display: flex;
    flex-direction: row;
    float: left;
    position: relative;
    height: 100%;
    align-items: center;
    padding-left: 20px;
  }
</style>