<template>
  <div class="upload_single_img">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="image_url" :src="image_url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
import comm from '../../utils/comm'
export default {
  props: {
    image_url: {
      type: String,
      default: '',
      isRequrie: true
    }
  },
  data() {
    return {
      uploadUrl: comm.baseUrl + `/api/admin/article/putImg`
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        const imageUrl = res.url
        const imagePath = res.path
        this.$emit('change_img', imageUrl, imagePath)
        this.$message({
          type: 'success',
          message: res.msg
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    handleAvatarError(res, file) {
      this.$message.error('上传失败')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang='scss'>
.upload_single_img {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
