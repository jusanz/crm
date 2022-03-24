const article_elem = {
    props: ['json', 'url'],
    computed: {
      rendered() {
        return DOMPurify.sanitize(marked.parse(this.json.body));
      }
    },

    methods: {
    },

    template: `
    <article class="card my-2" @click="()=>{$emit('to_edit', url);}">
      <div class="card-body" v-html="rendered">
      </div>
    </article>
    `
}
