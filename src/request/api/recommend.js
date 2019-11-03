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
  // 获取recommend文章
  get_recommend(params) {
    return request({
      method: 'GET',
      url: '/admin/recommend/get_recommend',
      params: params
    })
  },
  // 添加recommend文章
  add_article_by_id(params) {
    return request({
      method: 'Post',
      url: '/admin/recommend/add_article_by_id',
      params: params
    })
  },
  // 删除recommend
  delete_recommend(params) {
    return request({
      method: 'Post',
      url: '/admin/recommend/delete_recommend',
      params: params
    })
  },
  // 修改recommend权重
  update_weight(params) {
    return request({
      method: 'Post',
      url: '/admin/recommend/update_weight',
      params: params
    })
  }
}
