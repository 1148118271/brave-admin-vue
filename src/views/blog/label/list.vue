<template>
  <div class="app-container">
    <el-button plain @click="add" >新增</el-button>
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
          <el-link type="primary" @click="update(scope.row)" >编辑</el-link>
          &nbsp;&nbsp;
          <el-popconfirm title="是否删除该条数据!" @onConfirm="deleteLabel(scope.row.id)">
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
    >
    </el-pagination>

    <el-dialog title="博客新增或者修改" :visible.sync="addDialogVisible" v-if="addDialogVisible" center width="30%">
      <add-or-update ref="addOrUpdate" :labelInfo="labelInfo" @refresh="selectLabelList" @close-add="addDialogVisible = false" ></add-or-update>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button :loading="addLoading" type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from '@/views/blog/label/addOrUpdate'
export default {
  name: 'List',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      labelInfo: {},
      addLoading: false,
      addDialogVisible: false,
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      column: [
        {
          label: '主键',
          prop: 'id'
        },
        {
          label: '标签标识',
          prop: 'label_key'
        },
        {
          label: '标签名称',
          prop: 'label_value'
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
    this.selectLabelList()
  },
  methods: {
    // 查询博客信息列表
    selectLabelList() {
      const v = {
        page_size: this.page.pageSize,
        current_page: this.page.currentPage
      }
      this.$http.post('/blog/label/page/list', v).then(data => {
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
    // 新增
    addOrUpdate() {
      this.$refs.addOrUpdate.addOrUpdate()
    },
    // 新增打开弹窗
    add() {
      this.labelInfo = {}
      this.addDialogVisible = true
    },
    // 修改打开窗口
    update(v) {
      this.labelInfo = v
      this.addDialogVisible = true
    },
    // 删除
    deleteLabel(id) {
      this.$http.get('/blog/label/del/' + id).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.selectLabelList()
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
