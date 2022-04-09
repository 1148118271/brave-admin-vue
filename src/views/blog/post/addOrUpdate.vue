<template>
  <div>
    <mavon-editor
      ref="md"
      v-model="value"
      :ishljs="true"
      @save="save"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
    />
  </div>
</template>

<script>
export default {
  name: 'PostAddOrUpdate',
  props: {
    blogInfoId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      value: '',
      blogPost: {}
    }
  },
  mounted() {
    this.getByInfoId()
  },
  methods: {
    getByInfoId() {
      this.$http.get('/blog/post/get/' + this.blogInfoId).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        if (data.data) {
          this.blogPost = data.data
          this.value = data.data.post_text
        }
      }).catch(e => {
        this.$msg.error(e)
      })
    },

    save(value, render) {
      this.blogPost.post_text = value
      this.blogPost.post_html = render
      this.blogPost.blog_info_id = this.blogInfoId
      this.$http.post('/blog/post/addOrUpdate', this.blogPost).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
      }).catch(e => {
        this.$msg.error(e)
      })
    },

    $imgAdd(index, $file) {
      const formData = new FormData()
      formData.append('file', $file)
      this.$http.post('/file/upload/blog.info', formData).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$refs.md.$img2Url(index, process.env.VUE_APP_BASE_API + '/' + data.data)
      }).catch(e => {
        this.$msg.error(e)
      })
    },

    $imgDel($file) {
      const rFile = $file[0].replace(process.env.VUE_APP_BASE_API + '/', '')
      const json = {
        file_path: rFile
      }
      this.$http.post('/file/delete', json).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
