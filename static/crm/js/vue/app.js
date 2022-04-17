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

        _get: async function (url) {
            await axios.get(url)
                .then((response) => {
                    this.data = response.data.results;
                })
                .catch((error) => {
                    alert(error)
                });
        },

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

        reload() {
            this.loading = true;
            this._get(document.schedule_list_url).then(() => {
                this.loading = false;
            });
        },

        update(url, json) {
            this._patch(url, { "json": json }).then(() => {
                this.reload();
            });
        },
        create(json) {
            this._post(document.schedule_list_url, { "json": json }).then(() => {
                this.reload();
            });
        },
        edit_schedule(url) {
            this.$refs.schedule_edit_modal.show(url);
        },
        create_new() {
            this.$refs.schedule_edit_modal.show(document.schedule_list_url);
        },
        date_url(date_str) {
            return document.schedules_date_url + date_str + '/';
        },
    },

    created() {
        this.reload();

        const date = new Date();
        date.setDate(date.getDate() + 31);
        for (let i = 0; i < 62; i++) {
            date.setDate(date.getDate() - 1);
            this.dates.push(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
        }
    },

    mounted() {
        const today = new Date();
        const today_id = "date-" + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        console.log(today_id)
        const today_elem = document.getElementById(today_id);
        today_elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        const today_elem_class = today_elem.getAttribute("class");
        today_elem.setAttribute("class", today_elem_class + " bg-info")
    },

    template: `
      <div class="container">

        <button class="btn btn-primary" @click="create_new">new</button>


        <article
        v-for="date in dates"
        :key="date"
        class="mt-5"
        >
            <h2 :id="'date-' + date.replaceAll('/', '-')">{{ date }}</h2>
        
            <schedule_date
            :url="date_url(date)"
            />
        </article>

        <schedule_edit_modal
        ref="schedule_edit_modal"
        @hidden="reload"
        />

      </div>
      `
};