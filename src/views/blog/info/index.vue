<template>
  <div class="app-container">
    <el-button plain @click="blogInfoAddDialog">新增</el-button>
    <br />
    <br />
    <el-table border :data="tableData">
      <el-table-column v-for="(c, index) in column" :key="index" :prop="c.prop" :label="c.label">
        <template slot-scope="scope">
          <span v-if="c.formatter">
            {{c.formatter(scope.row[c.prop])}}
          </span>
          <span v-else-if="c.html">
            <div v-html="c.html(scope.row)"></div>
          </span>
          <span v-else>
            {{scope.row[c.prop]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary" @click="blogInfoUpdateDialog(scope.row)">编辑</el-link>
          &nbsp;&nbsp;
          <el-link type="warning" @click="postDialog(scope.row.id)">帖子</el-link>
          &nbsp;&nbsp;
          <el-popconfirm title="是否发布帖子!"  @onConfirm="publishPost(scope.row.id)">
            <el-link slot="reference" type="success" >发布</el-link>
          </el-popconfirm>
          &nbsp;&nbsp;
          <el-popconfirm title="是否删除该条数据!"  @onConfirm="deleteInfo(scope.row)">
            <el-link slot="reference" type="danger" >删除</el-link>
          </el-popconfirm>
          &nbsp;&nbsp;
          <el-link slot="reference" type="danger" @click="comments(scope.row.id)">查看评论</el-link>
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

    <el-dialog title="博客新增或者修改" :visible.sync="dialogVisible" v-if="dialogVisible" center width="30%">
      <blog-add-or-update ref="blogAddOrUpdate" :blog-info-id="id" @close-add="closeBlogInfoDialog"></blog-add-or-update>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeBlogInfoDialog">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdateBlogInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="帖子"
      :visible.sync="postVisible"
      v-if="postVisible"
      center
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="postCloseDialog"
    >
      <post-add-or-update :blog-info-id="blogInfoId"></post-add-or-update>
    </el-dialog>

    <el-dialog title="评论" :visible.sync="commentsVisible" v-if="commentsVisible" center width="30%">
      <comments :blog-id="blogInfoId"></comments>
    </el-dialog>

  </div>
</template>

<script>
import BlogAddOrUpdate from '@/views/blog/info/addOrUpdate'
import PostAddOrUpdate from '@/views/blog/post/addOrUpdate'
import Comments from '@/views/blog/comments/index'

export default {
  name: 'Index',
  components: {
    BlogAddOrUpdate,
    PostAddOrUpdate,
    Comments
  },
  data() {
    return {
      commentsVisible: false,
      loading: false,
      dialogVisible: false,
      postVisible: false,
      blogInfoId: null,
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
      tableData: [],
      id: null
    }
  },
  mounted() {
    this.selectInfo()
  },
  methods: {
    // 分页改变
    changePage(currentPage) {
      this.page.currentPage = currentPage
      this.selectInfo()
    },
    // 查询博客信息列表
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
    // 关闭博客信息修改或新增Dialog
    closeBlogInfoDialog() {
      this.dialogVisible = false
      this.selectInfo()
    },
    // 打开博客信息修改Dialog
    blogInfoUpdateDialog(row) {
      this.id = row.id
      this.dialogVisible = true
    },
    // 打开博客信息新增Dialog
    blogInfoAddDialog() {
      this.id = null
      this.dialogVisible = true
    },
    // 博客信息新增或修改
    addOrUpdateBlogInfo() {
      if (this.id) {
        this.$refs.blogAddOrUpdate.editVal()
      } else {
        this.$refs.blogAddOrUpdate.addVal()
      }
    },
    // 删除博客信息
    deleteInfo(v) {
      this.$http.get('/blog/info/del/' + v.id).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.deletePost(v.id)
        this.selectInfo()
      }).catch(e => {
        this.$msg.error(e)
      })
    },
    // 删除帖子信息
    deletePost(blogInfoId) {
      this.$http.get('/blog/post/del/' + blogInfoId).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
      }).catch(e => {
        this.$msg.error(e)
      })
    },
    // 关闭帖子编辑页面Dialog
    postCloseDialog(done) {
      this.$confirm('是否关闭帖子编辑页面', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.postVisible = false
        return done(true)
      }).catch(() => {
        this.$msg.info('放弃关闭页面')
        return false
      })
    },
    // 打开帖子Dialog
    postDialog(id) {
      this.blogInfoId = id
      this.postVisible = true
    },
    // 发布帖子
    publishPost(id) {
      this.$http.get('/blog/post/publish/' + id).then(data => {
        if (data.code === 500) {
          this.$msg.error(data.msg)
          return
        }
        this.$msg.success(data.msg)
        this.selectInfo()
      }).catch(e => {
        this.$msg.error(e)
      })
    },
    // 打开评论列表
    comments(id) {
      this.blogInfoId = id
      this.commentsVisible = true
    }
  }
}
</script>

<style scoped>

</style>
