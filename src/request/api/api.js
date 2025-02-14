import { request } from '../http'

// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-vars
var Api = {}
export default Api = {
  // 测试
  getTestData(params) {
    return request({
      method: 'Get',
      url: '/dev-api/table/list',
      params: params
    })
  },
  // 获取电影接口
  getMovieList(params) {
    return request({
      method: 'Get',
      url: '/admin/movie/list',
      params: params
    })
  },
  // 删除图片
  delPlotPics(params) {
    return request({
      method: 'Post',
      url: '/admin/movie/delPlotPics',
      params: params
    })
  },
  // 创建电影
  createMovie(params) {
    return request({
      method: 'Post',
      url: '/admin/smallvideo/add',
      params: params
    })
  },
  // 获取官方用户
  getOfficialUsers(params) {
    return request({
      method: 'GET',
      url: '/admin/user/list',
      params: params
    })
  },
  // 获取文章列表
  getArticleList(params) {
    return request({
      method: 'Get',
      url: '/admin/article/list',
      params: params
    })
  },
  // 删除指定文章
  delete_article(params) {
    return request({
      method: 'Post',
      url: '/admin/article/delete_article',
      params: params
    })
  },
  // 删除指定文章
  get_article_detail(params) {
    return request({
      method: 'GET',
      url: '/admin/article/get_detail',
      params: params
    })
  },
  // 上传文章
  release_article(params) {
    return request({
      method: 'Post',
      url: '/admin/article/release_article',
      params: params
    })
  }
}
