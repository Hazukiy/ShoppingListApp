<template>
    <div id="error-container">
        <div id="error-body">
            <div id="error-top">
                <i id="error-icon" class="fas fa-exclamation-circle fa-2x" :class="backgroundColour"></i>
                <h2 id="error-header" :class="backgroundColour">{{ title }}</h2>
            </div>
            <hr id="error-splitter">
            <span id="error-details"><b>Message:</b> {{ err }}</span>
        </div>
    </div>
</template>

<script>
export default {
  name: "ErrorModal",
  data() {
      return {
          backgroundColour: "text-danger",
          title: "Warning!",
          err: this.errorMessage,
          priority: this.errorPriority
      }
  },
  props: {
      errorMessage: String,
      errorPriority: Number
  },
  created() {
    if(this.priority == 0) {
        this.backgroundColour = "text-danger";
        this.title = "Error!";
    }
    else if (this.priority == 1) {
        this.backgroundColour = "text-warning";
        this.title = "Warning!";
    }

    // Scoll to top so we see there's an error
    window.scrollTo(0,0);
  }
};
</script>

<style scoped>
#error-container {
    padding: 10px;
    color: #e1e1e1;
    background-color: #570606;
    border: 1px solid #111111;
}

#error-top {
    display: flex;
    justify-content: baseline;
    height: 20px;
}

#error-header {
    padding-left: 10px;
    font-weight: bold;
}
</style>