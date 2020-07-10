<template>
  <div class="comment-tree">
        <div class="comment-tree-item" v-for="item in data" :key="item.id">
            <div class="avatar"></div>
            <div class="userinfo">
                <div class="username"></div>
                <div class="desc"></div>
            </div>
            <template v-if="item.children && item.children.length">
                <comment-tree :data="item.children"></comment-tree>
            </template>
        </div>
  </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style>

</style>
