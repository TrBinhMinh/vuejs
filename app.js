const app = Vue.createApp({
    data() {
        return {
            counter: 0,
            name: "",
            lastName: "",
            //fullname: "",
        };
    },
    methods: {
        confirmInput() {
            this.confirmedName = this.name;
        },
        add(num) {
            this.counter += num;
        },
        reduce(num) {
            this.counter -= num;
        },
        setName(e) {
            this.name = `${e.target.value}`;
        },
        submitForm() {
            alert("Form is submitted!");
        },
        resetInput() {
            this.name = this.lastName = "";
        },
        outputFullname() {
            if (this.name === "") return "";
            return this.name + " " + "Tran";
        },
    },
    watch: {
        counter(value) {
            if (value > 50) {
                setTimeout(() => {
                    this.counter = 0;
                }, 2000);
            }
        },
        // name(value) {
        //     if (value === "") this.fullname = "";
        //     else this.fullname = value + " " + this.lastName;
        // },
        // lastName(value) {
        //     if (value === "") this.fullname = "";
        //     else this.fullname = this.name + " " + value;
        // },
    },
    computed: {
        fullname() {
            console.log("Run again nigga!");
            if (this.name === "" || this.lastName === "") return "";
            return this.name + " " + this.lastName;
        },
    },
});

app.mount("#events");
