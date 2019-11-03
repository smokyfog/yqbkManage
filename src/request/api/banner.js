import { request } from '../http'

// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-vars
var Api = {}
export default Api = {
  // 获取文章列表
  getArticleList(params) {
    return request({
      method: 'Get',
      url: '/admin/article/list',
      params: params
    })
  },
  // 获取banner文章
  get_banner(params) {
    return request({
      method: 'GET',
      url: '/admin/banner/get_banner',
      params: params
    })
  },
  // 添加banner文章
  add_article_by_id(params) {
    return request({
      method: 'Post',
      url: '/admin/banner/add_article_by_id',
      params: params
    })
  },
  // 删除banner
  delete_banner(params) {
    return request({
      method: 'Post',
      url: '/admin/banner/delete_banner',
      params: params
    })
  },
  // 修改banner权重
  update_weight(params) {
    return request({
      method: 'Post',
      url: '/admin/banner/update_weight',
      params: params
    })
  }
}
