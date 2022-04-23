<template>
  <div class="app-container">
    <el-table border :data="tableData">
      <el-table-column v-for="(c, index) in column" :key="index" :prop="c.prop" :label="c.label">
        <template slot-scope="scope">
          <span v-if="c.formatter">
            {{c.formatter(scope.row[c.prop])}}
          </span>
          <span v-else-if="c.html">
            <div v-html="c.html(scope.row[c.prop])"></div>
          </span>
          <span v-else>
            {{scope.row[c.prop]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    blogId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      tableData: [],
      column: [
        {
          label: '主键',
          prop: 'id'
        },
        {
          label: '昵称',
          prop: 'name'
        },
        {
          label: '邮箱',
          prop: 'email'
        },
        {
          label: 'url',
          prop: 'url'
        },
        {
          label: '评论详情',
          prop: 'comment'
        }
      ]
    }
  },
  mounted() {
    this.selectComments()
  },
  methods: {
    selectComments() {
      this.$http.get('/blog/comments/info/' + this.blogId).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.tableData = data.data
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
