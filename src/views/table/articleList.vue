<template>
  <div class="app-container movielist">
    <div class="filter-container">
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        size="small"
        icon="el-icon-plus"
      > 新增视频
      </el-button> -->
    </div>
    <el-row>
      <el-col :span="24" class="">
        <el-collapse v-model="activeNames">
          <el-collapse-item title=" 筛选" name="1">
            <el-row :gutter="20" class="search_box">
              <el-col :span="6">
                <el-row>
                  <el-col :span="7"><div class="search_title">ID</div></el-col>
                  <el-col :span="17">
                    <el-input
                      v-model="search.id"
                      :span="18"
                      size="medium"
                      placeholder="请输入内容"
                      clearable
                      @input="search_ref"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="7"><div class="search_title">标题</div></el-col>
                  <el-col :span="17">
                    <el-input
                      v-model="search.search_title"
                      :span="18"
                      size="medium"
                      placeholder="请输入内容"
                      clearable
                      @input="search_ref"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="7"><div class="search_title">类型</div></el-col>
                  <el-col :span="17">
                    <el-select
                      v-model="search.type"
                      placeholder="请选择"
                      @change="search_ref"
                    >
                      <el-option
                        v-for="item in typeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="medium"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
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
      <el-table-column label="喜欢数" align="center">
        <template slot-scope="scope">
          {{ scope.row.likeCount || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="不喜欢数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dislikeCount || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.browseCount || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamps.createdAt || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamps.updatedAt || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="small"
              type="primary"
              @click="show_detai(scope.row._id)"
            >查看</el-button>
            <el-button
              size="small"
              type="success"
              @click="updateVideo(scope.row._id)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteVideo(scope.row._id)"
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
      :visible.sync="dialogTableVisible"
      width="1150px"
      top="30px"
    >
      <div
        class="video_box"
        v-html="article_content"
      />
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/request/api/api'
import Pagination from '@/components/Pagination'
import _ from 'lodash'

export default {
  components: { Pagination },
  filters: {
    wavType(val) {
      var num = parseInt(val)
      switch (num) {
        case 1: return '笔记'
        case 10: return '分享'
        default: return '未知'
      }
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
      dialogTableVisible: false,
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
      Api.getArticleList({ ...this.listQuery, ...this.search })
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
        const res = await Api.get_article_detail({ id })
        if (res.code === 0 && res.data.content) {
          this.dialogTableVisible = true
          this.article_content = res.data.content
        } else {
          this.$message({ type: 'error', showClose: true, message: res.data.msg })
        }
      } catch (err) {
        this.$message({ type: 'error', showClose: true, message: '请求失败！' })
      }
    },
    // 删除视频
    deleteVideo(id) {
      this.$confirm('是否删除该作品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.delete_article({ id })
          .then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.search_ref()
            } else {
              this.$notify.error({ title: '错误', message: response.message })
            }
          })
          .catch(() => {
            this.$message({ type: 'error', showClose: true, message: '请求失败！' })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑视频
    updateVideo(id) {

    }
  }
}
</script>

<style lang="scss" scoped>
  .movielist{
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
