<template>
    <div class="list-container">
        <div id="clear-container">
            <input type="text" class="form-control" id="searchItems" aria-describedby="searchForItems" placeholder="Search Items" @keyup="filterResults()">
            <button type="button" class="btn btn-primary btn-lg btn-block" @click="clearSelected()">Clear Selected</button>
        </div>
        <div v-for="item in sortArray" :key="item.name" class="shopping-item" @click="checkListItem(item)" :itemid="item.id">
            <div class="shopping-image">
                <img :src="computeImagePath(item)" :alt="item.name" />
            </div>
            <div class="shopping-details">
                <h4 id="item-text">{{ item.name }} - £{{ item.price.toFixed(2) }}</h4>
            </div>
            <div id="shopping-tick-container">
                <input type="checkbox" id="shopping-tick" />
            </div>
        </div>
        <footer class="fixed-bottom">
            <div class="container">
              <div id="cost-container">
                  <span id="total-price" class="text-warning">Total: £{{ totalAmount.toFixed(2) }} ({{ totalItems }} Items)</span>
              </div>
              <div id="controls-container">
                  <button type="button" class="btn btn-success btn-lg btn-block" @click="submitNewList()">Complete</button>
              </div>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
  data() {
    return {
      predefinedList: [],
      checkedList: [],
      totalAmount: 0.0,
      totalItems: 0,
      showModal: true,
      filterBySearch: false,
      searchTerm: ""
    }
  },
  mounted() {
    fetch('http://86.162.193.13:8081/getList')
    .then(res => res.json())
    .then(data => this.predefinedList = data)
    .catch(err => this.raiseError(err, 1))
  },
  computed: {
    sortArray() {
      // TODO: Almost fixed this
      let data = this.predefinedList;
      if(this.filterBySearch) {
        // Create timer to refresh just after filter
        this.reapplyDOMChanges();
        return data.filter(x => x.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }
      else {
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
    }
  },
  methods: {
    checkListItem(ref) {
        try {
            let index = this.checkedList.findIndex(cl => cl.id == ref.id);
            let doesExist = index == -1 ? false : true;

            if(index != -1) {
                this.checkedList.splice(index, 1);
                this.totalAmount -= ref.price;
                this.totalItems--;
                this.animateText(false);
            }
            else {
                this.checkedList.push(ref);
                this.totalAmount += ref.price;
                this.totalItems++;
                this.animateText(true);
            }
            this.updateDomState(ref, doesExist);
        }
        catch(err) {
            this.raiseError(err, 1);
        }
    },
    updateDomState(ref, doesExist) {
      let domElement = document.querySelectorAll(`[itemid="${ref.id}"]`)[0];
      if(domElement == undefined || domElement == null) {
        this.raiseError(`Cound not update DOM element for id ${ref.id} as its undefined or null`, 0);
        return;
      }

      let checkBox = domElement.querySelector('[id="shopping-tick"]');

      // If it does exist, we've removed it, otherwise we're adding it
      if(doesExist) {
        checkBox.checked = false;
      }
      else {
        checkBox.checked = true;
      }
    },
    clearSelected() {
      // Grab all the elements and filter based on selected and reset them
      Array
      .from(document.querySelectorAll('[id="shopping-tick"]'))
      .filter(f => f.checked)
      .forEach(e => e.checked = false);

      // Next splice the array and restore data to normal state
      this.checkedList.splice(0, this.checkedList.length);
      this.totalAmount = 0.0;
      this.totalItems = 0;
    },
    animateText(isAddition) {
      let text = document.getElementById("total-price");

      if(isAddition) {
        text.classList.remove("text-warning");
        text.classList.add("text-danger");

        setTimeout(function() { 
          text.classList.remove("text-danger");
          text.classList.add("text-warning");
        }, 300);
      }
      else {
        // Show green
        text.classList.remove("text-warning");
        text.classList.add("text-success");

        setTimeout(function() { 
          text.classList.remove("text-success");
          text.classList.add("text-warning");
        }, 300);
      }
    },
    submitNewList() {
        if(this.checkedList.length <= 0) {
          this.raiseError("No items selected", 1);
          return;
        }

        const requestParams = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(this.checkedList)
        };
        fetch('http://86.162.193.13:8081/submitList', requestParams)
        .then(response => response.json())
        .then(data => {
          if(data) {
            window.location.reload();
          }
          else {
            this.raiseError("Failed to add new list.", 0)
          }
        })
        .catch(err => this.raiseError(err, 1))
    },
    computeImagePath(ref) {
        return require(`@/assets/images/${ref.image}`);
    },
    raiseError(err, priority) {
      // NOTE: Priority - 0 = warning, 1 = fatal
      this.$el.dispatchEvent(new CustomEvent('raiseError', { detail: { 'errorMessage' : err, 'priority' : priority }, bubbles: true, composed: true }));
      
      if(console) {
        console.log(`Error raised (priority - ${priority}): ${err}`);
      }
    },
    filterResults() {
      let term = document.getElementById("searchItems").value;
      
      if(term.length > 0) {
        this.filterBySearch = true;
        this.searchTerm = term;
        this.reapplyDOMChanges();
      }
      else {
        this.filterBySearch = false;
        this.searchTerm = term;
        this.reapplyDOMChanges();
      }
    },
    reapplyDOMChanges() {
      // This sucks, but its a solution. Need to check if DOM is full loaded and then check.. somehow
      setTimeout(() => {
        for(let i = 0; i < this.checkedList.length; i++) {
            let domElement = document.querySelectorAll(`[itemid="${this.checkedList[i].id}"]`)[0];

            console.log(`ItemID: ${this.checkedList[i].id}`);

            if(domElement == null || domElement == undefined) {
              console.log("Value doesn't exist, so ignoring");
              continue;
            }

            let checkBox = domElement.querySelector('[id="shopping-tick"]');
            checkBox.checked = true;
        }
      }, 500);
    }
  }
};
</script>

<style scoped>
    #clear-container {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    #shopping-tick-container {
        display: flex;
        flex-direction: row;
        float: right;
        position: relative;
        height: 100%;
        align-items: center;
        padding-right: 20px;
    }

    #shopping-tick {
        zoom: 2;
        background-color: #1e1e1e;
        color: #1e1e1e;
        border-color: #1e1e1e;
    }

    #cost-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 49%;
        float: left;
        position: relative;
        align-items: center;
        justify-content: center;
    }

    #controls-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 49%;
        float: right;
        position: relative;
        align-items: flex-start;
    }

    #cost-container > span {
        font-size: 1em;
        line-height: 2.8em;
        margin: auto;
    }

    #item-text {
        font-size: 1em; /* To avoid pushing elements off the screen */
    }

    #searchItems {
      margin-bottom: 10px;
    }
</style>