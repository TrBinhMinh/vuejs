const app = Vue.createApp({
  data() {
    return {
      detailsAreVisible: false,
      friends: [
        {
          id: "vu",
          name: "Vu Ta",
          phone: "0869215538",
          email: "vuta@gmail.com",
        },
        {
          id: "thinh",
          name: "Thinh beat",
          phone: "0936665597",
          email: "thinhbeat@gmail.com",
        },
      ],
    };
  },
  methods: {
    toggleDetails(id) {
      this.detailsAreVisible = !this.detailsAreVisible;
    },
  },
});

app.mount("#app");
