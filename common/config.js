/****** config ******/
export const STORAGE_KEY = 'STORAGE_KEY'
export const WECHAT_NAME = '网密'
export const COLORS_PICK = ['#b7ba6b', '#426ab3', '#d93a49', '#f26522', '#006c54', '#c77eb5', '#472d56', '#c7a252', '#7c8577','#7f7522']

/****** 项目 ******/
export let BASE_URL = 'http://localhost:8003'
// #ifdef H5
BASE_URL = 'http://localhost:8000'
// #endif
if (process.env.NODE_ENV === 'production') {
	BASE_URL = 'https://abc.zhangjiale.club'
}