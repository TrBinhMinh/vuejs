<template>
  <section>
    <h2>My Friends</h2>
    <ul>
      <friend-contact />
      <friend-contact />
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      friends: [
        {
          id: "vuta",
          name: "Vu Ta",
          phone: "0885274343",
          email: "vuta@gmail.com",
        },
        {
          id: "thinhbeat",
          name: "Thinh Beat",
          phone: "0337238499",
          email: "thinhbeat@gmail.com",
        },
      ],
    };
  },
};
</script>
