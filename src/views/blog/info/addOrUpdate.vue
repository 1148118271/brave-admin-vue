<template>
  <el-form ref="form" :rules="rules" label-position="top" label-width="80px" :model="form">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" autocomplete="off" style="width: 100%"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="label_key">
      <el-select v-model="form.label_key" multiple filterable default-first-option placeholder="请选择文章标签" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BlogAddOrUpdate',
  props: {
    blogInfoId: {
      type: Number,
      default: null
    }
  },
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
    if (this.blogInfoId) {
      this.getBlogInfoById()
    }
  },
  methods: {
    // 查询标签列表
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
    // 根据id查询博客信息
    getBlogInfoById() {
      this.$http.get('/blog/info/byId/' + this.blogInfoId).then(data => {
        this.loading = false
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.form = data.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改博客信息
    editVal() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$msg.error('请填写必填项')
          return null
        }
        this.loading = true
        const value = {
          id: this.form.id,
          title: this.form.title,
          label_key: this.form.label_key.join(',')
        }
        this.$http.post('/blog/info/edit', value).then(data => {
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
    },
    // 添加博客信息
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
