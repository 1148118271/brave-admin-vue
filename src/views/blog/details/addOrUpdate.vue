<template>
  <div>
    <mavon-editor
      v-model="value"
      :ishljs="true"
      @save="save"
      @imgAdd="$imgAdd"
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

    $imgAdd(pos, $file) {
      const formData = new FormData()
      formData.append('file', $file)

      this.$http.post('/file/upload/blog.file', formData).then(data => {
        // if (data.code === 500) {
        //   this.$msg.error(data.msg)
        //   return
        // }
        // this.$msg.success(data.msg)
        // this.selectInfo()
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
