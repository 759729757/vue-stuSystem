import { baseUrl,oldUrl } from '../config'
import axios from 'axios';
import Router from '../router'

//过滤无效token的请求
axios.interceptors.response.use(function (response) {
  if( response.data && response.data.status == 10010 && document.location.href.indexOf('/@admin')>-1){
  //  token无效，重新登录
     console.log('interceptors：token无效，重新登录')
    Router.push({path:'/@adminLogin'})
  }
  return response;
},function (err) {
  return Promise.reject(err);
})

//管理员登录
export const adminLogin = params =>{ return axios.post(`${oldUrl}/admin/adminLogin`,params).then(res=>res.data) }

//上传新闻图片
export const uploadImageUrl = `${baseUrl}/photoLive/upload`;
export const uploadImage = params => { return axios.post(`${baseUrl}/photoLive/upload`, params).then(res => res.data); };
export const updateAlbum = params =>{ return axios.put(`${baseUrl}/photoLive/updateAlbum`,{params:params}); }

export const editInfo = params => { return axios.get(`${baseUrl}/photoLive/editInfo`, { params: params }); };

//设备借用相关
export const getEquApplylist = params => { return axios.get(`${oldUrl}/admin/getAllApplylist`, { params: params }); };
export const getOneEquRecode = params =>{ return axios.get(`${oldUrl}/admin/getOneRecode`,{params:params});};
export const approval = params =>{ return axios.get(`${oldUrl}/admin/approval`,{params:params});};
//设备相关
export const getAllEqu = params =>{ return axios.get(`${oldUrl}/admin/fetchAllEqu`,{params:params});};
export const sendEquipment = params => { return axios.post(`${oldUrl}/admin/sendEquipment`, params).then(res => res.data); };
export const updateEquipment = params =>{ return axios.get(`${oldUrl}/admin/updateEquipment`,{params:params});};
export const delEquipment = params =>{ return axios.get(`${oldUrl}/admin/delEquipment`,{params:params});};
export const equManager = params =>{ return axios.get(`${oldUrl}/admin/equManager`,{params:params});};
export const updateEquManager = params =>{ return axios.get(`${oldUrl}/admin/updateEquManager`,{params:params});};
export const deleteEquRecode = params =>{ return axios.get(`${oldUrl}/admin/deleteEquRecode`,{params:params});};
export const urgeEquipment = params =>{ return axios.get(`${oldUrl}/admin/urgeEquipment`,{params:params});};

//人员相关
export const getOneUser = params =>{ return axios.get(`${oldUrl}/admin/fetchStuInfo`,{params:params}); };
export const delOneUser = params =>{ return axios.get(`${oldUrl}/admin/deleteOneUser`,{params:params}); };
export const updateUser = params =>{ return axios.get(`${oldUrl}/admin/updateUser`,{params:params}); }
export const headImg = `${oldUrl}/images/userFacePic/`

//讲座相关
export const getLectureInfo = params =>{ return axios.get(`${oldUrl}/admin/getLectureInfo`,{params:params}); }
export const getLectureRecord = params =>{ return axios.get(`${oldUrl}/admin/getLectureRecord`,{params:params}); }
export const delLectureRecord = params =>{ return axios.get(`${oldUrl}/admin/deleteLectureRecordById`,{params:params}); }
export const sendLectureResult = params => { return axios.post(`${oldUrl}/admin/sendLectureResult`, params).then(res => res.data); };
export const addLectureRecord = params => { return axios.post(`${oldUrl}/admin/addLectureRecord`, params).then(res => res.data); };


//耦合空间权限相关
export const interchangeUrl = "http://stusystem.dfi.ac.cn/interchangeSpace";
export const getPermission = params => { return axios.get(`${oldUrl}/admin/getPermission`,{params:params}); }
export const getPermissionMajor = params => { return axios.get(`${oldUrl}/admin/getPermissionMajor`,{params:params}); }
export const delPermission = params => { return axios.get(`${oldUrl}/admin/delPermission`,{params:params}); }
export const delMajormission = params => { return axios.get(`${oldUrl}/admin/delMajormission`,{params:params}); }
export const addOnePermission = params => { return axios.post(`${interchangeUrl}/admin/addOnePermission`, params).then(res => res.data); };
export const addOnePermissionMajor = params => { return axios.post(`${interchangeUrl}/admin/addOnePermissionMajor`, params).then(res => res.data); };
export const queryStuInfo = params => { return axios.get(`${oldUrl}/admin/queryStuInfo`,{params:params}); }


