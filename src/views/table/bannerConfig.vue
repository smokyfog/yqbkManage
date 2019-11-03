<template>
  <div class="app-container banner_config">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addArticle"
      > 添加文章
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="deleteArticle"
      > 批量移除
      </el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column align="center" label="ID" width="220px">
        <template slot-scope="scope">
          {{ scope.row._id || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="200"
            trigger="hover"
            :content="scope.row.title || '未知'"
          >
            <div
              slot="reference"
              class="msg_show"
            >{{ scope.row.title || '未知' }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type | wavType }}
        </template>
      </el-table-column>
      <el-table-column label="banner" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 80px"
            :src="scope.row.imageUrl"
            :preview-src-list="[ scope.row.imageUrl ]"
          />
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="喜欢数" align="center">
        <template slot-scope="scope">
          {{ scope.row.likeCount }}
        </template>
      </el-table-column>
      <el-table-column label="不喜欢数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dislikeCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.browseCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.create_time | formatTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time | formatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="small"
              type="primary"
              @click="show_detai(scope.row.articleId)"
            >查看</el-button>
            <el-button
              size="small"
              type="warning"
              @click="update_weight(scope.row._id)"
            >权重</el-button>
            <el-button
              size="small"
              type="danger"
              @click="delete_banner(scope.row._id)"
            >删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="fetchData"
    />
    <el-dialog
      :visible.sync="dialogTableVisible1"
      width="1150px"
      top="30px"
    >
      <div
        class="video_box"
        v-html="article_content"
      />
    </el-dialog>

    <el-dialog
      :visible.sync="dialogTableVisible2"
      width="1150px"
      top="30px"
    >
      <ArticleList @addarticlebyid="addArticleById" />
    </el-dialog>
  </div>
</template>

<script>
import artApi from '@/request/api/api'
import Api from '@/request/api/banner'
import Pagination from '@/components/Pagination'
import ArticleList from '@/components/ArticleList'
import _ from 'lodash'

export default {
  components: {
    Pagination,
    ArticleList
  },
  filters: {
    wavType(val) {
      var num = parseInt(val)
      switch (num) {
        case 1: return '笔记'
        case 10: return '分享'
        default: return '未知'
      }
    },
    formatTime(val) {
      return val ? new Date(val).toLocaleString() : '未知'
    }
  },
  data() {
    return {
      list: null, // 列表
      listLoading: true,
      total: 0,
      activeNames: [],
      typeOption: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '日记'
        }, {
          value: 10,
          label: '分享'
        }
      ],
      listQuery: {
        page: 1,
        page_size: 20,
        importance: undefined,
        title: undefined,
        type: 1,
        sort: undefined
      },
      search: {
        id: undefined,
        search_title: '',
        type: undefined
      },
      videoSrc: null,
      selectedData: [],
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      curr_lrc: '',
      msg_show: '测试',
      article_content: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData() {
      this.listLoading = true
      Api.get_banner({ ...this.listQuery })
        .then(response => {
          if (response.code === 0) {
            this.total = response.total
            this.list = response.data
            this.listLoading = false
          } else {
            this.$notify.error({ title: '错误', message: response.message })
          }
        })
        .catch(() => {
          this.$message({ type: 'error', showClose: true, message: '请求失败！' })
        })
    },
    // 筛选事件
    search_ref: _.debounce(function() {
      this.fetchData()
    }, 300),
    // 选择事件
    handleSelectionChange(rows) {
      this.selectedData = rows
    },
    // 查看详情
    async show_detai(id) {
      try {
        const res = await artApi.get_article_detail({ id })
        if (res.code === 0 && res.data.content) {
          this.dialogTableVisible1 = true
          this.article_content = res.data.content
        } else {
          this.$message({ type: 'error', showClose: true, message: res.data.msg })
        }
      } catch (err) {
        this.$message({ type: 'error', showClose: true, message: '请求失败！' })
      }
    },
    // 添加
    addArticle() {
      this.dialogTableVisible2 = true
    },
    // 添加文章
    async addArticleById(ids) {
      const res = await Api.add_article_by_id({ ids })
        .catch(err => {
          this.$message.error('请求错误' + err)
        })
      if (res && res.code === 0) {
        this.search_ref()
        this.$message({
          message: '成功',
          type: 'success'
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 删除文章
    deleteArticle(ids) {
      console.log(ids)
    },
    // 删除
    async delete_banner(ids) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await Api.delete_banner({ ids })
          .catch(err => {
            this.$message({
              type: 'info',
              message: '请求失败', err
            })
          })
        if (res && res.code === 0) {
          this.search_ref()
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    // 配置权重
    async update_weight(_id) {
      this.$prompt('请输入权重', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^-?[1-9]\d*$/,
        inputErrorMessage: '格式不正确'
      }).then(async({ value }) => {
        const weight = parseInt(value)
        const res = await Api.update_weight({ _id, weight })
          .catch(err => {
            this.$message.error('请求失败', err)
          })
        if (res && res.code === 0) {
          this.search_ref()
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner_config{
    .filter-container {
      padding-bottom: 10px !important;
    }
    .search_title {
      line-height: 38px;
      text-align: center;
    }
    .search_box {
      min-height: 20px;
      padding: 19px;
      background-color: #fbfbfb;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 0px;
    }
    /deep/ .vl-notify-content {
      padding: 0px !important;
    }
    /deep/ .vl-notify-btns {
      display: none;
    }
    /deep/ .vl-notify-mask {
      z-index: 9999 !important;
    }
    /deep/ .vl-notify-main {
      z-index: 10000 !important;
    }
    /deep/ .fa-play-circle {
      font-size: 24px;
      color: #3a8ee6;
      cursor: pointer;
    }
    /deep/ .el-collapse-item__header {
      line-height: 30px;
      height: 30px;
      padding: 0 10px;
      border: 1px solid #EBEEF5;
    }
    /deep/ .el-collapse-item__wrap {
      border-left: 1px solid #EBEEF5;
      border-right: 1px solid #EBEEF5;
    }
    /deep/  .el-collapse {
      border-top: none;
      border-bottom: none;
    }
    .lrc_box {
      line-height: 30px;
      text-align: center;
      min-height: 20px;
      padding: 19px;
      margin-bottom: 20px;
      background-color: #f5f5f5;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    .msg_show {
      max-width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .play{
      font-size: 25px;
      cursor: pointer;
    }
    .video_box{
      width: 1100px;
      height: 600px;
      overflow: auto;
    }
  }
</style>
