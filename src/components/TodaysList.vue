<template>
    <div class="list-container">
      <h4 class="text-danger text-center">Today's List - £{{ totalAmount.toFixed(2) }}</h4>
        <div v-for="item in sortArray" :key="item.name" class="shopping-item" @click="completeListItem(item)" :itemid="item.id">
          <div class="shopping-image">
            <img :src="computeImagePath(item)" :alt="item.name" />
          </div>
          <div class="shopping-details">
            <h4>{{ item.name }} - £{{ item.price.toFixed(2) }}</h4>
          </div>
        </div>
        <div id="noteContainer">
          <textarea id="notes" v-model="notes"></textarea>
        </div>
        <footer class="fixed-bottom">
          <div class="container">
            <button type="button" class="btn btn-success btn-lg btn-block" @click="completeList()">Complete Shopping</button>
          </div>
        </footer>
    </div>
</template>

<script>
export default {
  data() {
    return {
      listToday: [],
      notes: "",
      totalAmount: 0.0
    }
  },
  computed: {
    sortArray() {
      let data = this.listToday;
      return data.sort(function(a, b) {
        let val1 = a.region;
        let val2 = b.region;
        if(val1 < val2) {
          return -1;
        }
        if(val1 > val2) {
          return 1;
        }
        return 0;
      });
    }
  },
  mounted() {
    fetch('http://lukeharv.com:8081/getListToday')
    .then(res => res.json())
    .then(data => {
      this.listToday = data;

      // Calculate the total
      for(let i = 0; i < this.listToday.length; i++) {
        this.totalAmount += this.listToday[i].price;
      }
    })
    .catch(err => this.raiseError(err, 1))

    fetch('http://lukeharv.com:8081/getNotesToday')
    .then(res => res.json())
    .then(data => {     
      this.notes = data.notes;
    })
    .catch(err => this.raiseError(err, 1))
  },
  methods: {
    computeImagePath(ref) {
      return require(`@/assets/images/${ref.image}`);
    },
    completeListItem(ref) {
      let domElement = document.querySelectorAll(`[itemid="${ref.id}"]`)[0];
      if(domElement == undefined || domElement == null) {
        this.raiseError(`Cound not update DOM element for id ${ref.id} as its undefined or null`, 0);
        return;
      }

      // TODO: Make a cache file which we read from so it doesn't reset
      domElement.remove();

      // Clear it from the array
      let index = this.listToday.findIndex(cl => cl.id == ref.id);
      this.listToday.splice(index, 1);

      // Clear the list
      if(this.listToday.length <= 0) {
        this.completeList();
      }
    },
    completeList() {
      fetch('http://lukeharv.com:8081/removeList', {
        method: "POST"
      })
      .then(response => response.json())
      .then(data => {
        if(!data) {
          fetch('http://lukeharv.com:8081/removeNotes', {
            method: "POST"
          })
          .then(response => response.json())
          .then(data => {
            if(!data) {
              window.location.reload();
            }
            else {
              this.raiseError("Failed to remove shopping list.", 0);
            }
          })
          .catch(err => this.raiseError(err, 1))
        }
        else {
          this.raiseError("Failed to remove shopping list.", 0);
        }
      })
      .catch(err => this.raiseError(err, 1))
    },
    raiseError(err, priority) {
      // NOTE: Priority - 0 = warning, 1 = fatal
      this.$el.dispatchEvent(new CustomEvent('raiseError', { detail: { 'errorMessage' : err, 'priority' : priority }, bubbles: true, composed: true }));
      
      if(console) {
        console.log(`Error raised (priority - ${priority}): ${err}`);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#notes {
  width: 100%;
  height: 150px;
  overflow-y: scroll;
}

</style>