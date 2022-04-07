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
  name: 'AddOrUpdate',
  data() {
    return {
      value: ''
    }
  },

  methods: {
    save(value, render) {
      console.info('value', value)
      console.info('html', render)
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
