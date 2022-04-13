const to_str = (d) => {
    const _d = new Date(d)
    _d.setMinutes(_d.getMinutes() - _d.getTimezoneOffset()); // local -> utc
    return _d.toISOString().slice(0, 16) // show as utc
};

const parse_str = (s) => {
    const d = new Date(s); // read as local
    // d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); // utc input -> local
    return d
};

const plus_60min = (d) => {
    let date = new Date(d);
    date.setMinutes(date.getMinutes() + 60);
    return date
}

const minus_60min = (d) => {
    let date = new Date(d);
    date.setMinutes(date.getMinutes() - 60);
    return date
}

const schedule_edit_modal = {
    props: [],
    emits:["hidden"],
    data() {
        return {
            json: {},
            new: true,
            response_data: {},
            start_datetime: new Date(),
            end_datetime: new Date(),
            modal: null,
            url: "",
            title: "",
            all_day: false,
        }
    },
    methods: {

        _get: async function (url, func) {
            await axios.get(url)
                .then((response) => {
                    if (response.data.results) {
                        this.new = true;
                    } else {
                        this.new = false;
                        this.json = response.data.json;
                    }
                })
                .catch((error) => {
                    alert(error)
                });
        },

        _post: async function (url, data, func) {
            await axios.post(url, data)
                .then((response) => {
                    this.url = response.data.url;
                    this.new = false;
                    this.response_data = response.data.json;
                })
                .catch((error) => {
                    alert(error)
                });
        },

        _patch: async function (url, data, func) {
            await axios.patch(url, data)
                .then((response) => {
                    this.response_data = response.data.json;
                })
                .catch((error) => {
                    alert(error)
                });
        },

        show(url) {
            this.init();
            this.url = url;
            this._get(this.url)
                .then(() => {
                    if (this.new) {
                        const start_datetime_ts = this.start_datetime.getTime() / 1000; // local
                        const end_datetime_ts = this.end_datetime.getTime() / 1000; // local
                        this.json = {
                            title: this.title,
                            schedule: {
                                start_datetime: start_datetime_ts,
                                end_datetime: end_datetime_ts,
                            },
                        };
                    } else this.reload();
                    this.modal.show();
                })
        },

        _update(func) {
            // if (this.new && !this.json.body) return
            if (this.json === this.response_data) return

            const start_datetime_ts = this.start_datetime.getTime() / 1000; // local
            const end_datetime_ts = this.end_datetime.getTime() / 1000; // local

            this.json.schedule.start_datetime = start_datetime_ts;
            this.json.schedule.end_datetime = end_datetime_ts;
            this.json.title = this.title;
            this.json.schedule.all_day = this.all_day;

            if (this.new) {
                this._post(this.url, { json: this.json }).then(func.apply());
            } else {
                this._patch(this.url, { json: this.json }).then(func.apply());
            }
        },

        init() {
            this.json= {};
            this.new =  true;
            this.response_data =  {};
            this.start_datetime =  new Date();
            this.end_datetime =  new Date();
            this.url =  "";
            this.title =  "";
            this.all_day = false;
        },

        on_submit() {
            this._update(() => {
                this.modal.hide();
            });
        },

        on_change() {
            this._update(() => {
            });
        },

        reload() {
            if (!this.url) return;
            this.title = this.json.title;
            if ("all_day" in this.json.schedule) this.all_day = this.json.schedule.all_day;

            this.start_datetime = new Date(this.json.schedule.start_datetime * 1000); // utc

            if (!this.json.schedule.end_datetime) {
                this.end_datetime = plus_60min(this.start_datetime);
                return;
            }
            this.end_datetime = new Date(this.json.schedule.end_datetime * 1000); // utc
        },


        change_start_datetime() {
            this.start_datetime = parse_str(this.$refs.start_datetime_input.value)
            //if (this.start_datetime.getTime() > this.end_datetime.getTime()) {
            //    this.end_datetime = plus_60min(this.start_datetime);
            //}
            this.end_datetime = plus_60min(this.start_datetime);
            this.on_change();
        },

        change_end_datetime() {
            this.end_datetime = parse_str(this.$refs.end_datetime_input.value)
            if (this.start_datetime.getTime() > this.end_datetime.getTime()) {
                this.start_datetime = minus_60min(this.end_datetime);
            }
            this.on_change();
        },

    },

    mounted() {
        let modal_el = this.$refs.modal;
        modal_el.addEventListener('hidden.bs.modal', (event) => {
            this.init();
            this.$emit("hidden");
        });
        this.modal = new bootstrap.Modal(modal_el, {})
        //this._get(this.url);
        //this.reload();
    },

    computed: {
        start_datetime_str() {
            return to_str(this.start_datetime)
        },
        end_datetime_str() {
            return to_str(this.end_datetime)
        },
    },

    template: `
    <div ref="modal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
        <div class="modal-body">

    <form @submit.prevent="on_submit">
        <label>Title:</label>
        <input class="form-control" type="text" v-model="title" @change="on_change"/>

        <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="all_day" id="IsAllDay">
            <label class="form-check-label" for="IsAllDay">
                All Day
            </label>
        </div>

        <div class="row">
            <div class="col-3">
            <label>Start DateTime:</label>
            <input class="form-control" type="datetime-local" ref="start_datetime_input"
                :value="start_datetime_str" @blur="change_start_datetime" >
            </div>

            <div class="col-3">
            <label>End DateTime:</label>
            <input class="form-control" type="datetime-local" ref="end_datetime_input"
                :value="end_datetime_str" @blur="change_end_datetime" >
            </div>
        </div>
        
        <button class="btn btn-primary" type="submit">Submit</button>
    </form>

        </div>
        </div>
    </div>
    </div>
  `
}
