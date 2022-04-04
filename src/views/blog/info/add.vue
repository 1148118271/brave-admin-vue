<template>
  <el-form ref="form" :rules="rules" label-position="top" label-width="80px" :model="form">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" autocomplete="off" style="width: 100%"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="label_key">
      <el-select v-model="form.label_key" multiple filterable allow-create default-first-option placeholder="请选择文章标签" style="width: 100%">
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
      options: [],
      rules: {
        title: [
          {
            required: true,
            message: '请输入博客标题',
            trigger: 'blur'
          }
        ],
        label_key: [
          {
            required: true,
            message: '请选择博客标签',
            trigger: 'blur'
          }
        ]
      }
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
    },

    clearVal() {
      this.form = {}
    },

    addVal() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$msg.error('请填写必填项')
          return null
        }
        this.loading = true
        const value = {
          title: this.form.title,
          label_key: this.form.label_key.join(',')
        }
        this.$http.post('/blog/info/add', value).then(data => {
          this.loading = false
          if (data.code === 500) {
            this.$msg.error(data.msg)
            return
          }
          this.$msg.success(data.msg)
          this.$emit('close-add')
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
