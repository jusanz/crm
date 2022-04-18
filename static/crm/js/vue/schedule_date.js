const schedule_date = {
    props: ["url"],
    emits: ["to_edit", "delete"],
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
            @to_edit="(url)=>{$emit('to_edit', url)}"
            @delete="(url)=>{$emit('delete', url)}"
        />
    `
}