const App = {
    props: [],
    data() {
        return {
            data: [],
            loading: false,
            dates: [],
        }
    },
    methods: {

        _post: async function (url, data) {
            await axios.post(url, data)
                .then((response) => {
                })
                .catch((error) => {
                    alert(error)
                });
        },

        _patch: async function (url, data) {
            await axios.patch(url, data)
                .then((response) => {
                })
                .catch((error) => {
                    alert(error)
                });
        },

        update(url, json) {
            this._patch(url, { "json": json }).then(() => {
                this.reload();
            });
        },

        edit_schedule(url) {
            this.$refs.schedule_edit_modal.show(url);
        },

        create_new(date_str) {
            this.$refs.schedule_edit_modal.show(document.schedule_list_url, date_str);
        },

        date_url(date_str) {
            return document.schedules_date_url + date_str + '/';
        },

        reload() {
            this.dates.forEach(date => {
                this.$refs['date-' + date.replaceAll('/', '-')].reload();
            });
        },
    },

    created() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        for (let i = 0; i < 62; i++) {
            this.dates.push(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
            date.setDate(date.getDate() - 1);
        }
    },

    mounted() {
        const today = new Date();
        const today_id = "date-" + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const today_elem = document.getElementById(today_id);
        today_elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        const today_elem_class = today_elem.getAttribute("class");
        today_elem.setAttribute("class", today_elem_class + " bg-info")
    },

    template: `
      <div class="container">

        <article
        v-for="date in dates"
        :key="date"
        class="card mb-5"
        >

        <div class="card-body">

            <h5
            :id="'date-' + date.replaceAll('/', '-')"
            @click="create_new(date)"
            class="card-title"
            >
            {{ date }}
            </h5>
        
            <schedule_date
            :url="date_url(date)"
            @to_edit="edit_schedule"
            :ref="'date-' + date.replaceAll('/', '-')"
            />
        
        </div>

        </article>

        <schedule_edit_modal
        ref="schedule_edit_modal"
        @hidden="reload"
        />

      </div>
      `
};