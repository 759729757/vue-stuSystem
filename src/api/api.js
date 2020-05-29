import {baseUrl, oldUrl} from '../config'
import axios from 'axios';

//过滤无效token的请求
axios.interceptors.response.use(function (response) {
  if( response.data && response.data.status == 10010 ){
  //  token无效，重新登录
     console.log('interceptors：token无效，重新登录')
    // window.location.href ='http://www.baidu.com'
  }
  return response;
},function (err) {
  return Promise.reject(err);
})

//线上视频课程相关
export const uploadCoureseImageUrl = `${oldUrl}/courese/uploadImage`;
export const getCourese = params => { return axios.get(`${oldUrl}/courese/fetchVideo`, { params: params }); };
export const watchCourese = params => { return axios.get(`${oldUrl}/courese/watch`, { params: params }); };
export const uploadReadRecord = params => { return axios.post(`${oldUrl}/courese/readRecord`, params).then(res => res.data); };
export const fetchReadRecord = params => { return axios.get(`${oldUrl}/courese/fetchRecord`, { params: params }); };
export const getCoureseType = params => { return axios.get(`${oldUrl}/courese/coureseType`, { params: params }); };
export const uploadSuggest = params => { return axios.post(`${oldUrl}/courese/suggest`, params).then(res => res.data); };


export const requestLogin = params => { return axios.post(`${baseUrl}/login`, params).then(res => res.data); };

export const loginByCode = params => { return axios.get(`${baseUrl}/user/loginByCode`, { params: params }); };
//拿用户信息（微信获取的那些）
export const getUser = params => { return axios.get(`${baseUrl}/user/getUser`, { params: params }); };
//拿用户信息（详细的，数据库录入的）
export const getUserDetail = params => { return axios.get(`${baseUrl}/user/getUserDetail`, { params: params }); };

//上传本人照片
export const register = params =>{ return axios.post(`${baseUrl}/user/register`,params).then(res => res.data) }

//讲座查询相关
export const oldLecture = params => { return axios.get(`${baseUrl}/record/oldLecture`,{ params : params }); }
//讲座查询相关记录
export const lecture = params => { return axios.get(`${baseUrl}/record/lecture`,{ params : params }); }

export const InvalidLecture = params => { return axios.get(`${baseUrl}/record/invalidLecture`,{ params : params }); }
//查询近期n次讲座的打卡记录
export const lectureRecord = params => { return axios.get(`${baseUrl}/record/lectureRecord`,{ params : params }); }

//设备借用相关

export const applyForEquipment = params => { return axios.post(`${baseUrl}/equipment/applyForEquipment`,params).then(res => res.data); };

export const applyList = params => { return axios.get( `${baseUrl}/record/equRecord`,{params : params} ); }

//活动照片直播~
export const fetchPhoto = params =>{ return axios.get(`${baseUrl}/photoLive/`,{params:params} ); }



