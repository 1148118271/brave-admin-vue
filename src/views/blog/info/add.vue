<template>
  <el-form label-position="top" label-width="80px" :model="form">
    <el-form-item label="标题">
      <el-input v-model="form.title" autocomplete="off" style="width: 100%"></el-input>
    </el-form-item>
    <el-form-item label="标签">
      <el-select v-model="form.label" multiple filterable allow-create default-first-option placeholder="请选择文章标签" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      form: {},
      options: [
        // {
        //   label: 'rust',
        //   value: '1'
        // },
        // {
        //   label: 'java',
        //   value: '2'
        // }
      ]
    }
  },
  mounted() {
    this.get_blog_label()
  },
  methods: {
    get_blog_label() {
      this.$http.post('/blog/label/select').then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.options = data.data
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
