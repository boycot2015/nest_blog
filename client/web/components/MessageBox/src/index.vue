<template>
    <div class="message-box clearfix" :class="`${visible ? 'active': ''} ${type}`">
        <i :class="`fl icon-${type}`"></i>
        <p class="text fl">{{ message }}</p>
    </div>
</template>
<style lang="less" scoped>
.message-box {
    position: fixed;
    top: -100px;
    left: 50%;
    margin-left: -100px;
    // width: 200px;
    color: @primary;
    transition: top 0.3s;
    z-index: 100000;
    border-radius: 5px;
    line-height: 20px;
    padding: 10px;
    box-shadow: 0 0 10px @white;
    &.active {
        top: 20px;
    }
    &.success {
        color: @success;
        background: #f0f9eb;
        border-color: #c2e7b0;
        box-shadow: 0 0 10px #c2e7b0;
    }
    &.error {
        color: @error;
        background: #fef0f0;
        border-color: #fbc4c4;
        box-shadow: 0 0 10px #fbc4c4;
    }
    &.warning {
        color: @warning;
        background: #fdf6ec;
        border-color: #f5dab1;
        box-shadow: 0 0 10px #f5dab1;
    }
    i {
        font-size: 18px;
        color: @c-333;
        margin-right: 10px;
        &.icon-success:after {
            content: '\e6b3';
            font-family: 'iconfont';
            font-size: 18px;
            color: @success;
        }
        &.icon-error:after {
            content: '\e626';
            font-family: 'iconfont';
            font-size: 18px;
            color: @error;
        }
        &.icon-warning:after {
            content: '\e618';
            font-family: 'iconfont';
            font-size: 18px;
            color: @warning;
        }
    }
    .text {
        max-width: 300px;
        font-size: 14px;
    }
}
</style>
<script>
export default {
    data () {
        return {
            visible: false,
            message: '',
            type: 'success'
        }
    }
}
</script>

<style>

</style>
