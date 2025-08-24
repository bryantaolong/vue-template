import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        children: [
            {

            }
        ]
    },
    {
        path: '/login',
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue')
            }
        ]
    },
    {
        path: '/register',
        children: [
            {
                path: '',
                name: 'Register',
                component: () => import('@/views/auth/Register.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth || to.meta.requiresAdmin) {
        if (!userStore.userInfo && userStore.token) {
            try {
                const res = await userStore.fetchUserInfo()
                if (res.code !== 200 || !userStore.userInfo) {
                    alert('认证信息失效，请重新登录！')
                    userStore.logout()
                    return next('/login')
                }
            } catch (error) {
                console.error('路由守卫获取用户信息失败:', error)
                alert('网络错误或认证失败，请重新登录！')
                userStore.logout()
                return next('/login')
            }
        } else if (!userStore.token) {
            alert('您尚未登录，请先登录。')
            return next('/login')
        }
    }

    if (to.meta.requiresAuth) {
        const isUser = userStore.userInfo && userStore.userInfo.roles.includes('ROLE_USER')
        if (!isUser) {
            alert('您尚未登录，请登录！')
            return next('/')
        }
    }

    if (to.meta.requiresAdmin) {
        const isAdmin = userStore.userInfo && userStore.userInfo.roles.includes('ROLE_ADMIN')
        if (!isAdmin) {
            alert('您没有权限访问此页面！')
            return next('/')
        }
    }

    next()
})

router.onError((error, to, from) => {
    console.error('Vue Router 导航错误:', error)
    console.error('跳转目标:', to)
    console.error('跳转来源:', from)
})

export default router
