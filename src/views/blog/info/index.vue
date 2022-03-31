<template>
  <div class="app-container">
  <el-table border :data="tableData">
    <el-table-column v-for="c in column" :key="c.prop" :prop="c.prop" :label="c.label">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini">编辑</el-button>
        <el-button size="mini" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div style="text-align: center; margin-top: 30px;"></div>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="page.total"
      @current-change="page.currentPage">
  </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      page: {
        total: 100,
        pageSize: 10,
        currentPage: 1
      },
      column: [
        {
          label: '主键',
          prop: 'id'
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '博客分类',
          prop: 'label_key'
        },
        {
          label: '是否发表',
          prop: 'is_publish'
        },
        {
          label: '发表时间',
          prop: 'publish_time'
        },
        {
          label: '阅读数',
          prop: 'read_count'
        },
        {
          label: '评论数',
          prop: 'comments_count'
        },
        {
          label: '创建时间',
          prop: 'address'
        },
        {
          label: '修改时间',
          prop: 'address'
        }
      ],
      tableData: []
    }
  },
  methods: {
    // selectInfo() {
    //   this.$http.post('/login', this.loginForm).then(data => {
    //   }).catch(() => {
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
