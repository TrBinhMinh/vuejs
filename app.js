const app = Vue.createApp({
  data() {
    return {
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

app.component("friend-contact", {
  template:
    /*html*/
    `
    <li>
      <h2>{{ friend.name }}</h2>
      <button @click="toggleDetails">{{ detailsAreVisible ? 'Hide' : 'Show' }} Details</button>
      <ul v-show="detailsAreVisible">
        <li><strong>Phone:</strong> {{ friend.phone }}</li>
        <li><strong>Email:</strong> {{ friend.email }}</li>
      </ul>
    </li>
  `,
  data() {
    return {
      detailsAreVisible: false,
      friend: {
        id: "vu",
        name: "Vu Ta",
        phone: "0869215538",
        email: "vuta@gmail.com",
      },
    };
  },
  methods: {
    toggleDetails() {
      this.detailsAreVisible = !this.detailsAreVisible;
    },
  },
});

app.mount("#app");
