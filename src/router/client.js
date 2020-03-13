//普通客户端
import Home from '@/view/client/Home'
import Index from '@/view/client/index'
import NotFound from '@/view/404'
import Equipment from '@/view/client/equipment/equipment'
import Site from '@/view/client/equipment/site'
import Lecture from '@/view/client/tools/lecture'
import Volunteer from '@/view/client/tools/volunteer'
import User from '@/view/client/user/index'
import FaceId from '@/view/client/user/faceId'
import EquRecord from '@/view/client/user/equRecord'
import EquRecordList from '@/components/equRecordList'
import Album from '@/view/client/album/index'
import PhotoPreview from '@/view/client/album/photo-preview'
import Course from '@/view/client/courese'
import CourseRead from '@/view/client/courese/read'
import CourseRecord from '@/view/client/courese/record'
import CourseSuggest from '@/view/client/courese/suggest'
import routers_admin from './admin'


export const routes = [
    {
      path: '/equipment',
      name: '设备',
      component: Home,
      iconCls: 'equipment',
      children: [
        { path: '/', component: Equipment, name: '设备借用' },
        { path: 'equRecordList', component: EquRecordList, name: '借用记录' },
      ]
    },
    {
      path: '/tools/',
      name: '记录',
      component: Home,
      iconCls: 'tools',
      children: [
          { path: '/', component: Lecture, name: '讲座记录' },
          { path: 'volunteer', component: Volunteer, name: '志愿时记录' }
        ]
    },
    {
      path: '/mine/',
      name: '我的',
      component: Home,
      iconCls: 'mine',
      children: [
          { path: '/', component: User, name: '我的' },
          { path: 'faceId', component: FaceId, name: '面部识别' },
          { path: 'equRecord', component: EquRecord, name: '设备借用记录' }
        ]
    },
    {
      path: '/album',
      name: '相册',
      component: PhotoPreview,
      iconCls: ''
    },
    {
      path: '/courese',
      name: 'MOOC of Brand University',
      component: Course,
      iconCls: ''
      },
    {
      path: '/courese/read',
      name: 'MOOC of Brand University',
      component: CourseRead,
      iconCls: ''
    },
    {
      path: '/courese/record',
        name: 'MOOC of Brand University',
      component: CourseRecord,
      iconCls: ''
    },
  {
    path: '/courese/suggest',
    name: 'MOOC of Brand University',
    component: CourseSuggest,
    iconCls: ''
  },
    {
      path: '/',
      name: '首页',
      component: Index,
      iconCls: ''
    },


    //404页面
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }

]

export default routes



