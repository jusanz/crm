const article_elem = {
    props: ['json', 'url'],
    computed: {
      rendered() {
        let dirty = marked.parse(this.json.body);
        return DOMPurify.sanitize(dirty, { ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] });
        // return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] });
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
