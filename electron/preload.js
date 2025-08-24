// 在 preload 中可以安全暴露 Node API 给前端
window.myAPI = {
    doSomething: () => {
        console.log('Hello from preload!');
    }
};
