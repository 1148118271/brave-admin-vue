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
          <span v-else-if="c.html">
            <div v-html="c.html(scope.row[c.prop])">scope.row[c.prop]</div>
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
          <el-popconfirm title="是否删除该条数据!" @onConfirm="deleteInfo(scope.row.id)">
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
      <add-or-update ref="addOrUpdate" :links-info="linksInfo" @refresh="selectLinksList" @close-add="addDialogVisible = false" ></add-or-update>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from '@/views/blog/links/addOrUpdate'
export default {
  name: 'List',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      addDialogVisible: false,
      linksInfo: {},
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
          label: '友链名称',
          prop: 'link_name'
        },
        {
          label: '友链url',
          prop: 'link_url',
          html(val) {
            return `<a href="${val}" target="_blank">${val}</a>`
          }
        },
        {
          label: '是否展示',
          prop: 'flag',
          formatter(val) {
            return val === '1' ? '展示' : '不展示'
          }
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
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.selectLinksList()
  },
  methods: {
    // 查询博客信息列表
    selectLinksList() {
      const v = {
        page_size: this.page.pageSize,
        current_page: this.page.currentPage
      }
      this.$http.post('/blog/links/page', v).then(data => {
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
    // 新增打开弹窗
    add() {
      this.linksInfo = {}
      this.addDialogVisible = true
    },
    // 修改打开窗口
    update(v) {
      this.linksInfo = v
      this.addDialogVisible = true
    },
    // 新增
    addOrUpdate() {
      this.$refs.addOrUpdate.addOrUpdate()
    },
    // 删除
    deleteInfo(id) {
      this.$http.get('/blog/links/del/' + id).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.selectLinksList()
      }).catch(e => {
        this.$msg.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
