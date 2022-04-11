const schedule_elem = {
    props: ['json', 'url'],
    data() {
        return {
            start_datetime: new Date(),
            end_datetime: new Date(),
        } 
    },


    methods: {
        reload() {
            this.start_datetime = new Date(this.json.schedule.start_datetime * 1000); 
            this.end_datetime = new Date(this.json.schedule.end_datetime * 1000); 
        }
    },

    computed: {
        year() {
            return this.start_datetime.getFullYear();
        },

        month() {
            return this.start_datetime.getMonth() + 1;
        },

        day() {
            return this.start_datetime.getDate();
        },

        start_hour() {
            const hour = this.start_datetime.getHours();
            return (hour < 10 ? "0": "") + hour;
        },

        start_min() {
            const min = this.start_datetime.getMinutes();
            return (min < 10 ? "0": "") + min;
        },

        end_hour() {
            const hour = this.end_datetime.getHours();
            return (hour < 10 ? "0": "") + hour;
        },

        end_min() {
            const min = this.end_datetime.getMinutes();
            return (min < 10 ? "0": "") + min;
        },
    },

    mounted() {
        this.reload();
    },

    watch: {
        json(_new_value, _old_value) {
            this.reload();
        },
    },

    template: `
    <article class="card my-2">
    <div class="card-body">

    <h5 class="card-title">{{ json.title }}</h5>
    <p class="card-text">{{ year }} / {{ month }} / {{ day }}</p>
    <p class="card-text">{{ start_hour }}:{{ start_min }} - {{ end_hour }}:{{ end_min }}</p>
    
    </div>
    </article>
    `
}
