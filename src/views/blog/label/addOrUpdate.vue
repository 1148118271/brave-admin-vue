<template>
  <el-form ref="form" :rules="rules" label-position="top" :model="form">
    <el-form-item label="标签标识" prop="label_key">
      <el-input v-model="form.label_key" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="标签名称" prop="label_key">
      <el-input v-model="form.label_value" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddOrUpdate',
  props: {
    labelInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: { ...this.labelInfo },
      rules: {
        label_key: [
          {
            required: true,
            message: '请输入标签标识',
            trigger: 'blur'
          }
        ],
        label_value: [
          {
            required: true,
            message: '请输入标签名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 添加或修改博客信息
    addOrUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$msg.error('请填写必填项')
          return null
        }
        this.loading = true
        this.$http.post('/blog/label/addOrUpdate', this.form).then(data => {
          this.loading = false
          if (data.code === 500) {
            this.$msg.error(data.msg)
            return
          }
          this.$msg.success(data.msg)
          this.$emit('refresh')
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
