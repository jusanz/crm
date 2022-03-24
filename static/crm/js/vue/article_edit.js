const article_edit = {
  props: ["prop_url", "next_url"],
  data() {
    return {
      loading: false,
      json: {},
      timer: null,
      new: true,
      response_data: {},
    }
  },
  methods: {
    _get:async function(url, func) {
      await axios.get(url)
        .then((response) => {
          if (response.data.results) return
          this.new = false;
          this.json = response.data.json;
        })
        .catch((error) => {
          alert(error)
        });
    },

    _post:async function(url, data, func) {
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

    _patch:async function(url, data, func) {
      await axios.patch(url, data)
        .then((response) => {
          this.response_data = response.data.json;
        })
        .catch((error) => {
          alert(error)
        });
    },

    update(func) {
      if (this.new && !this.json.body) return
      if (this.json === this.response_data) return

      if (this.new) {
        this._post(this.url, {json: this.json}).then(func.apply());
      } else {
        this._patch(this.url, {json: this.json}).then(func.apply());
      }
    },

    onInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.update(() => {
          //this.$emit("updated");
        });
      }, 3000)
    },

    reload() {
      this._get(this.url);
    },

    on_submit() {
      this.update(() => {
        this.$emit("submitted");
      });
    }
  },

  mounted() {
    this.url = this.prop_url;
    this.reload();
  },

  template: `
    <form @submit.prevent="on_submit">
      <textarea class="form-control" rows="10" autofocus @input="onInput" v-model="json.body"></textarea>
      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
  `
}
