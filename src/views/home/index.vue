<template>
  <div class="home">
    <!-- 导航栏 （添加fixed 属性让头部导航栏固定）-->
    <van-nav-bar
      title="首页" fixed
    />
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active" animated swipeable>
      <van-tab :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      >
        <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
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
            >
            <!-- 宫格 -->
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image lazy-load height="80" :src="img" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime }}</span>
                  </div>
                  <van-icon name="close" />
                </div>
              </div>
            </van-cell>
          </van-list>
          <!-- /文章列表 -->
        </van-pull-refresh>
      </van-tab>

        <!-- 面包按钮 -->
        <div slot="nav-right" class="wap-nav" @click="isChannelEditShow = true">
          <van-icon name="wap-nav" size="24"/>
        </div>

    </van-tabs>

    <!-- 频道管理 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      :style="{ height: '95%' }"
      round
      closeable
      close-icon-position="top-left"
    >

      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
          <van-button type="danger" size="mini">编辑</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
           v-for="(channel,index) in channels"
           :key="index"
           :text="channel.name"
           />
        </van-grid>

        <van-cell title="推荐频道" :border="false">
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item
           v-for="(channel,index) in recommondChannels"
           :key="index"
           :text="channel.name"
           @click="onAddChannel(channel)"
           />
        </van-grid>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { getItem, setItem } from '@/utils/storage' // 操作本地存储
// import { loadavg } from 'os'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      // list: [],
      // loading: false,
      // finished: false,
      channels: [], // 存放频道列表
      isChannelEditShow: true, // 弹窗
      allChannels: []// 存放所有频道
    }
  },
  watch: {
    channels (newVal) {
      setItem('channels', newVal)
    }
  },
  computed: {
    // 计算推荐属性
    recommondChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
      // 判断 channel 是否存在我的频道中
      // 如果不存在，就证明它是剩余推荐的频道

        // 数组的 find 方法
        // 它会遍历数组，每遍历一次，它就判定 item.id === channel.id
        // 如果 true，则停止遍历，返回满足该条件的元素
        // 如果 false，则继续遍历
        // 如果直到遍历结束都没有找到符合 item.id === channel.id 条件的元素，则返回 undefined
        const ret = this.channels.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })

      return arr
    // return 所有频道 - 我的频道
    }
  },
  created () {
    this.loadChannels() // 获取我的频道
    this.loadAllChannels() // 获取所有频道
  },
  methods: {
    // 添加频道
    onAddChannel (channel) {
      this.channels.push(channel)
    },

    // 获取所有频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log(data)
      this.allChannels = data.data.channels
    },

    // 下拉刷新
    async onRefresh () {
      // 获取当前激活的频道对象
      const activeChannel = this.channels[this.active]
      // 1,请求获取最新推荐的文章列表
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(),
        with_top: 1
      })

      // 2,将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)

      // 3,关闭下拉刷新的loading状态
      activeChannel.isPullDownLoading = false

      // 4,提示
      this.$toast('刷新成功')
    },

    // 上拉加载更多
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

    // 加载频道列表
    async loadChannels () {
      let channels = []
      // 读取本地存储的频道列表
      const localChannels = getItem('channels')

      // 如果有本地存储的频道列表就使用本地存储的频道列表
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有本地存储的频道列表，则请求获取后台推荐的频道列表
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }

      // 为每个频道添加自定义数据：文章列表 loading finished
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 存储获取频道下一页时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新loading状态
      })
      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.home {
    .article-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .meta span {
        margin-right: 10px;
      }
    }
    .channel-container {
      padding-top: 30px;
    }
    .van-tabs {
      .wap-nav {
        position: sticky;
        right: 0;
        display: flex;
        align-items: center;
        background-color: #fff;
        opacity: 0.8;
      }
      /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      left: 0;
      right: 16px;
      z-index: 2;
      }
      /deep/ .van-tabs__content {
      margin-top: 90px;
      margin-bottom: 50px;
      }
    }
}
</style>
