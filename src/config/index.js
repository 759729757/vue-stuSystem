
//旧版的接口
export const oldUrl = 'http://de.bnuz.edu.cn/stuInfoSystem'

//配置是否处于开发模式，默认是
let isDevelop = true;
// isDevelop = false; //否，为上线模式 ，如果要上线，解除该行注释再 build

//开发模式，和上线模式的接口不一样
export let baseUrl = isDevelop ? '/stuInfoSystem' : '/stuInfoSystem/stuEduSystem';








