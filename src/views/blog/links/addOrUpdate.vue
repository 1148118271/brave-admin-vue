<template>
  <el-form ref="form" :rules="rules" label-position="top" :model="form">
    <el-form-item label="友链名称" prop="link_name">
      <el-input v-model="form.link_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="友链url" prop="link_url">
      <el-input v-model="form.link_url" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="是否展示" prop="flag">
      <el-radio-group v-model="form.flag">
        <el-radio label="1">展示</el-radio>
        <el-radio label="0">不展示</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AddOrUpdate',
  props: {
    linksInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        flag: '0'
      },
      rules: {
        link_name: [
          {
            required: true,
            message: '请输入友链名称',
            trigger: 'blur'
          }
        ],
        link_url: [
          {
            required: true,
            message: '请输入友链url',
            trigger: 'blur'
          }
        ],
        flag: [
          {
            required: true,
            message: '请选择是否展示',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    if (JSON.stringify(this.linksInfo) !== '{}') {
      this.form = { ...this.linksInfo }
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
        this.$http.post('/blog/links/addOrUpdate', this.form).then(data => {
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
