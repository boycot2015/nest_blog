import config from '@/config'
export const state = () => ({
    websiteConfig: '', // 网站信息及首页数据
    asideConfig: '', // 右侧公告数据
    authUser: null, // 用户信息
    fixedComponentQuery: '',
    totalIntegral: 0, // 积分数量
    newMsgNum: 0, // 消息数量
    DetailInfoBooleans: {}, // 网站配置信息  对象
    visitors: '',
    importNoticeToken: false, // 重大通知标识
    importNotice: [], // 重大通知数组
    aboutData: config.about || {} // 关于我页面数据
})

export const mutations = {
    // 重大通知逐条递减
    setImportNotice (state, data) {
        if (data) {
            state.importNotice = data
        } else {
            state.importNotice.shift()
        }
    },
    setnewMsgNum (state, data) {
        state.newMsgNum = data
    },
    SET_USER (state, user) {
        state.authUser = user
        state.totalIntegral = user.totalIntegral
        state.newMsgNum = user.newMsgNum
    },
    setCommonData (state, [settingRes, homeRes]) {
        if (settingRes && homeRes && settingRes.success && homeRes.success) {
            settingRes = settingRes.data
            for (const key in settingRes) {
                if (key === 'banner' ||
                    key === 'theme' ||
                    key === 'siteConfig' ||
                    key === 'activity' ||
                    key === 'notice') {
                    if (key !== null) {
                        settingRes[key] = JSON.parse(settingRes[key])
                    } else {
                        settingRes[key] = {}
                    }
                }
            }
            state.websiteConfig = { ...settingRes, ...homeRes.data }
        } else {
            state.websiteConfig = {}
        }
    },
    setAsideData (state, [tagRes, categoryRes]) {
        if (tagRes && tagRes.success && categoryRes && categoryRes.success) {
            state.asideConfig = {
                tagList: tagRes.data[0],
                tagTotal: tagRes.data[1],
                categoryList: categoryRes.data[0],
                categoryTotal: categoryRes.data[1]
            }
        } else {
            state.asideConfig = {
                tagList: [],
                tagTotal: 0,
                categoryList: [],
                categoryTotal: 0
            }
        }
        // console.log(state.asideConfig)
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        // console.log(req.origin)
    },
    login ({ commit }, data) {
        commit('SET_USER', data)
    }
}
