<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar
      title="首页"
    />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      >
        <!-- 文章列表
            loading 控制上拉加载更多的loading效果
            finished 控制是否已加载结束
            finished-text 加载结束的提示文本
            @load="onLoad" 上拉加载更多触发的事件
         -->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in channel.articles"
            :key="item"
            :title="item"
          />
        </van-list>
        <!-- /文章列表 -->
      </van-tab>
      <!-- <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel'

// import { loadavg } from 'os'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      // list: [],
      // loading: false,
      // finished: false,
      channels: []// 存放频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    onLoad () {
      // 激活当前频道对象
      const activeChannel = this.channels[this.active]

      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          activeChannel.articles.push(activeChannel.articles.length + 1)
        }
        // 加载状态结束
        activeChannel.loading = false

        // 数据全部加载完成
        if (activeChannel.articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 500)
    },
    async loadChannels () {
      const { data } = await getDefaultChannels()
      const channels = data.data.channels

      // 为每个频道添加自定义数据：文章列表 loading finished
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
      })
      this.channels = channels
    }
  }
}
</script>

<style>

</style>
