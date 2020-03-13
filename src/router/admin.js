//后端管理端
import Admin from '@/view/admin/Home'
import Login from '@/view/admin/Login'

import UserInfo from '@/view/admin/userInfo/user'
import Activity from '@/view/admin/news/activity'

import EquipmentApply from '@/view/admin/equipment/approval'
import Manager from '@/view/admin/equipment/manager'
import Equipment from '@/view/admin/equipment/equipment'

import SendLecture from '@/view/admin/record/sendLectureRecord'
import EditLecture from '@/view/admin/record/editLectureRecord'
import Statistics from '@/view/admin/record/lectureStatistics'

import PersonMission from '@/view/admin/interchangeSpace/personMission'
import MajorMission from '@/view/admin/interchangeSpace/majorMission'

import Courese from '@/view/admin/courese/'
import CoureseUpload from '@/view/admin/courese/upload'
import CoureseType from '@/view/admin/courese/type'

const routers_admin =[

  {
    path:'/@admin',
    name:'用户信息',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:UserInfo, name:"所有用户"}
    ]
  },
  {
    path:'/@admin/interchangespace',
    name:'耦合空间',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:PersonMission, name:"个人权限"},
      {path:'major', component:MajorMission, name:"专业权限"},
    ]
  },
  {
    path:'/@admin/equipment',
    name:'设备相关',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:EquipmentApply, name:"设备申请"},
      {path:'equipment', component:Equipment, name:"设备管理"},
      {path:'manager', component:Manager, name:"设备管理员"}
    ]
  },
  {
    path:'/@admin/record',
    name:'讲座/志愿 记录',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:SendLecture, name:"上传讲座记录"},
      {path:'editLecture', component:EditLecture, name:"编辑考情数据"},
      {path:'statistics', component:Statistics, name:"讲座记录统计"}
    ]
  },
  {
    path:'/@admin/news',
    name:'活动/新闻',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:Activity, name:"近期活动"}
    ]
  },
  {
    path:'/@admin/courese',
    name:'网课视频',
    type:'管理端',
    component:Admin,
    icon: 'fa fa-id-card-o',
    children:[
      {path:'', component:Courese, name:"网课视频"},
      {path:'upload', component:CoureseUpload, name:"上传视频"},
      {path:'type', component:CoureseType, name:"视频类型"},
      {path:'edit', component:CoureseUpload, name:"修改视频",hidden:true},
    ]
  },
  {
    path:'/@adminLogin',
    name:'登录',
    type:'',
    component:Login,
    icon: ''
  },
]

export default routers_admin

