const schedule_date = {
    props:["url"],
    data() {
        return {
            schedules: [],
        }
    },
    methods: {
        reload: async function () {
            get(this.url,
            (response) => {
                this.schedules = response.data;
            }),
            (error) => {
                alert(error);
            }
        },
    },
    mounted() {
        this.reload();
    },
    template: `
        <schedule_elem
            v-for="elem in schedules"
            :key="elem.pk"
            :json="elem.json"
            :url="elem.url"
            @click="edit_schedule(elem.url)"
        />
    `
}