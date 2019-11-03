<template>
  <div class="put_article components-container">
    <div>
      <tinymce ref="tinymce" v-model="content" :isinit="isInit" :height="800" />
    </div>
    <div class="oper_box">
      <el-button
        type="primary"
        @click="show_release_article"
      >详情</el-button>
    </div>
    <el-dialog
      title="发布文章"
      :visible.sync="dialogTableVisible"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="文章名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="是否禁止显示" label-width="120px">
          <el-select v-model="form.disabled">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择类型" label-width="120px">
          <el-select v-model="form.type">
            <el-option label="笔记" value="1" />
            <el-option label="分享" value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="banner图" label-width="120px">
          <UploadSingleImg
            :image_url="imageUrl"
            @change_img="change_img"
          />
        </el-form-item>
        <el-form-item label="文章描述" label-width="120px">
          <el-input v-model="form.desc" rows="5" type="textarea" />
        </el-form-item>
        <el-form-item class="oper_box">
          <el-button
            type="primary"
            @click="release_article"
          >确认</el-button>
          <el-button
            @click="quit"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import UploadSingleImg from '@/components/UploadSingleImg'
import Api from '@/request/api/api'

export default {
  name: 'TinymceDemo',
  components: {
    Tinymce,
    UploadSingleImg
  },
  data() {
    return {
      form: {
        title: '',
        desc: '',
        type: '1',
        disabled: '0'
      },
      dialogTableVisible: false,
      imageUrl: '',
      content: '',
      isInit: !this.$route.query.id
    }
  },
  async mounted() {
    const id = this.$route.query.id
    if (id) {
      const res = await Api.get_article_detail({ id })
      if (res.code === 0) {
        const data = res.data
        this.form = {
          title: data.title,
          desc: data.info || '',
          type: data.type,
          disabled: data.disabled || 0
        }
        this.imageUrl = data.imageUrl || ''
        this.content = data.content || ''
      }
      this.$refs.tinymce.init()
    }
  },
  methods: {
    // 发布文章
    show_release_article() {
      this.dialogTableVisible = true
    },
    // 取消发布框的显示
    quit() {
      this.dialogTableVisible = false
      this.form = {
        title: '',
        desc: '',
        type: '',
        disabled: ''
      }
      this.imageUrl = ''
    },
    async release_article() {
      const _id = this.$route.query.id
      const res = await Api.release_article(
        {
          content: this.content,
          ...this.form,
          imageUrl: this.imageUrl,
          _id
        }
      )
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    change_img(url) {
      this.imageUrl = url
    }
  }
}
</script>

<style lang="scss" scoped>
.put_article {
  .oper_box {
    display: flex;
    justify-content: center;
    margin-left: 0px;
    margin-bottom: 0;
    button {
      margin: 10px 10px;
    }
  }
}
</style>

