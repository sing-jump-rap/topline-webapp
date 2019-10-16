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
            v-for="(article,index) in channel.articles"
            :key="index"
            :title="article.title"
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
import { getArticles } from '@/api/article'
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
    async onLoad () {
      // 激活当前频道对象
      const activeChannel = this.channels[this.active]

      // 向接口请求获取数据
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道id
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳
        with_top: 1// 是否包含顶置
      })
      // 将数据添加到频道列表
      activeChannel.articles.push(...data.data.results)

      // 结束当前频道loading
      activeChannel.loading = false

      // 判断是否还有下一页数据
      if (data.data.pre_timestamp) {
        // 获取下一页数据页码的时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 无数据
        activeChannel.finished = true
      }
    },
    async loadChannels () {
      const { data } = await getDefaultChannels()
      const channels = data.data.channels

      // 为每个频道添加自定义数据：文章列表 loading finished
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 存储获取频道下一页时间戳
      })
      this.channels = channels
    }
  }
}
</script>

<style>

</style>
