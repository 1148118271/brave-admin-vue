<template>
  <div class="app-container">
  <el-table border :data="tableData">
    <el-table-column v-for="(c, index) in column" :key="index" :prop="c.prop" :label="c.label">
      <template slot-scope="scope">
      <span v-if="c.formatter">
          {{ c.formatter(scope.row[c.prop])}}
      </span>
      <span v-else>
          {{ scope.row[c.prop]}}
      </span>
      </template>
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
      :current-change="page.currentPage">
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
          prop: 'label_key',
          formatter(val) {
            if (!val) {
              return '-'
            }
            return val.toString()
          }
        },
        {
          label: '是否发表',
          prop: 'is_publish'
        },
        {
          label: '发表时间',
          prop: 'publish_time',
          formatter(val) {
            if (!val) {
              return '-'
            }
            return val.replace('T', ' ')
          }
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
          prop: 'create_time',
          formatter(val) {
            if (!val) {
              return '-'
            }
            return val.replace('T', ' ')
          }
        },
        {
          label: '修改时间',
          prop: 'update_time',
          formatter(val) {
            if (!val) {
              return '-'
            }
            return val.replace('T', ' ')
          }
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.selectInfo()
  },
  methods: {
    selectInfo() {
      const v = {
        page_size: this.page.pageSize,
        current_page: this.currentPage
      }
      this.$http.post('/blog/info', v).then(data => {
        if (data.code === 500) {
          this.$msg(data.msg)
          return
        }
        this.page = data.data.page
        this.tableData = data.data.data
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
