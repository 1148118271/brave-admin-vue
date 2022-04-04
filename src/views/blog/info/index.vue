<template>
  <div class="app-container">
    <el-button plain @click="dialogVisible = true">新增</el-button>
    <br />
    <br />
    <el-table border :data="tableData">
      <el-table-column v-for="(c, index) in column" :key="index" :prop="c.prop" :label="c.label">
        <template slot-scope="scope">
          <span v-if="c.formatter">
            {{c.formatter(scope.row[c.prop])}}
          </span>
          <span v-else>
            {{scope.row[c.prop]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary">编辑</el-link>
          &nbsp;&nbsp;
          <el-popconfirm title="是否删除该条数据!"  @onConfirm="deleteInfo(scope.row)">
            <el-link slot="reference" type="danger" >删除</el-link>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center; margin-top: 30px;"></div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="page.total"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      @current-change="changePage"
    >
    </el-pagination>

    <el-dialog title="博客新增" :visible.sync="dialogVisible" center width="30%">
      <Add ref="add" @close-add="closeAdd"></Add>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addBlogInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Add from '@/views/blog/info/add'

export default {
  name: 'Index',
  components: {
    Add
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
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
          prop: 'is_publish',
          formatter(val) {
            return val === '1' ? '是' : '否'
          }
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
    changePage(currentPage) {
      this.page.currentPage = currentPage
      this.selectInfo()
    },
    selectInfo() {
      const v = {
        page_size: this.page.pageSize,
        current_page: this.page.currentPage
      }
      this.$http.post('/blog/info', v).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.page = data.data.page
        this.tableData = data.data.data
      }).catch(e => {
        this.$msg.error(e)
      })
    },

    closeAdd() {
      this.$refs.add.clearVal()
      this.dialogVisible = false
      this.selectInfo()
    },

    addBlogInfo() {
      this.$refs.add.addVal()
    },

    deleteInfo(v) {
      this.$http.get('/blog/info/del/' + v.id).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.selectInfo()
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
