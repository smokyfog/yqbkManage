<template>
  <div class="components-container">
    <!-- <aside>
      <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/component/rich-editor.html"></a>
    </aside> -->
    <div>
      <tinymce v-model="content" :height="800" />
    </div>
    <!-- <div class="editor-content" v-html="content" /> -->
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content:
      `<p><span class="mce-nbsp-wrap" contenteditable="false">&nbsp;&nbsp;&nbsp;</span>&nbsp;相信前端开发的朋友们，都有类似的经历。项目上线后，突然有一天收到部门Boss的反馈消息。<br />&nbsp;&nbsp;&nbsp;&nbsp;Boss:&nbsp;咦，小张呀！你看我们网站啊，有人反馈打开有点慢、打不开啊！你看下是怎么回事？<br />&nbsp;&nbsp;&nbsp;&nbsp;Me:&nbsp;好的，我去查下原因。最后通过各种手段来检查，都没有发现什么问题（我这打开挺快的呀，cdn资源加载也正常、后端数据调用接口速度也ok...心想，应该是部分用户网络的原因造成的吧！）。然后屁颠、屁颠的跑去Boss办公室去汇报，Boss 我通过xx手段，看了下。没啥问题呀！应该是部分用户网络造成的吧！</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;上述的例子，我想大家都肯定遇到过。那么有没有什么好的办法去解决呢？或者说从被动变为主动，第一时间掌握我们网站的健康情况。<br />&nbsp;&nbsp;&nbsp;&nbsp;想必有经验的朋友，肯定会说：这还不简单，上监控啊。可是具体怎么去搭建一个前端监控系统呢？别急，听我一一道来：</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;一、JS SDK 设计</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首先我们来试想一下，我们做的这个前端监控系统，希望它能解决什么样的痛点：<br /><br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551788088.png" /></p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、页面性能监控<br />&nbsp; &nbsp; &nbsp; &nbsp; 从前面我们了解到，网站的性能怎么样。不能单单是靠某种工具去检测，就能得出的结果。因为影响它的因素有很多（dns解析、网络、缓存...）, 再者如果没有拿到实际用户访问的数据，去跟别人交谈，心里也是没有底气的。<br /><br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551788130.png" width="600" height="360" /><br /><br />一般我们会通过浏览器的performance对象，来上报我们需要统计的数据和关键性能指标。一般统计的指标有以下：</p>\n<p>&nbsp;</p>\n<pre class="language-js"><code>    let timing = performance.timing\n\n    // DNS 解析耗时\n    timing.domainLookupEnd - timing.domainLookupStart\n\n    // TCP 连接耗时\n    timing.connectEnd - timing.connectStart\n\n    // SSL 安全连接耗时\n    timing.connectEnd - timing.secureConnectionStart\n\n    // 网络请求耗时\n    timing.responseStart - timing.requestStart\n\n    // 数据传输耗时\n    timing.responseEnd - timing.responseStart\n\n    // DOM 解析耗时\n    timing.domInteractive - timing.responseEnd\n\n    // 资源加载耗时\n    timing.loadEventStart - timing.domContentLoadedEventEnd \n\n    /* 关键性能指标 */\n\n    // 首包时间\n    timing.responseStart - timing.domainLookupStart\n \n    // 首次渲染时间 / 白屏时间\n    timing.responseEnd - timing.navigationStart \n\n    // 首次可交互时间\n    timing.domInteractive - timing.requestStart \n\n    // HTML 加载完成时间， 即 DOM Ready 时间\n    timing.domContentLoadedEventEnd - timing.navigationStart\n\n    // 页面完全加载时间\n    timing.loadEventStart - timing.navigationStart</code></pre>\n<p><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、错误监控</p>\n<p>&nbsp;</p>\n<p>&nbsp; &nbsp; &nbsp; （1）js 运行时报错<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 为了更好的保证网站正常的运行，我们会通过window.onerror捕获，js具体的堆栈信息和错误行和列。一般我们的js都是打包压缩、混淆后上传到cdn的（无法定位到具体错误）。因此在打包时，同时生产.map文件，用sourcemap js库（nodejs）来还原具体错误信息。如下图（出自个人博客中的数据）：<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551789429.png" /></p>\n<p>&nbsp; &nbsp; &nbsp;&nbsp;</p>\n<p>&nbsp; &nbsp; 有种情况 因为跨域的原因，浏览器捕获到的错误信息，很可能是&ldquo;Script error.&rdquo;，无法知道具体的错误行和列。因此面对此情况，可以在script标签添加crossorigin="anonymous" 属性，同时通过cdn开启cors跨域，即可解决。<br />&nbsp; &nbsp; &nbsp;（2）资源加载出错</p>\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 为了防止加载资源失败，而导致网站打不开。一般我们会通过 window.addEventListener('error') 对资源加载进行监控。<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、后端api接口监控<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 一般对于小公司而言，可能连后端都很少会有接口方面的监控。一旦出现问题，却又不好排查问题，因此我们可以通过对浏览器底层的xhr对象进行拦截，上报相关调用数据和接口耗时。一方面可以检测到接口的实时调用情况，同时也方便后期对接口的数据统计。</p>\n<p>&nbsp;<img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551789618.png" width="800" height="400" /></p>\n<p>&nbsp;</p>\n<p>&nbsp; &nbsp;&nbsp;二、数据处理和展示</p>\n<p>&nbsp; &nbsp; &nbsp;在设计完成sdk后，需要把数据进行统计分析和展示。因此我们用到 es（elasticsearch）来对数据进行实时查询和分析。可是怎么把数据推到es里面呢？这对于前端同学来说，这又是一个难点。别急，&ldquo;logstash&rdquo; 了解一下。logstash主要对数据进行采集、分析、过滤的工具，然后推送到es里面。数据既然有了，那么怎么展示呢？这时候 Kibana 出来了，来作为数据展示的承托。这就是后端开源届的日志分析系统&ldquo;ELK&rdquo;。</p>\n<p>&nbsp;</p>\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551789323.jpeg" /><br /><br /></p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其实对于数据的展示，可以不用kibana或者其他开源的产品进行展示，也可以自己通过es的restful接口，来搭建数据展示（如上图）。整体架构如下图：</p>\n<p>&nbsp;</p>\n<p>&nbsp; &nbsp;&nbsp;<img style="display: block; margin-left: auto; margin-right: auto;" src="https://cdn.duanliang920.com/uploads/article/2019-03-5/1551788285.png" width="800" height="400" /></p>\n<p>&nbsp;</p>\n<p>&nbsp; &nbsp;&nbsp;写在最后：本文只是阐述前端监控基本的一些理论方面的知识，没有涉及到具体实战环境。比如：sdk该如何设计、采用哪种方式上报比较好！数据处理部分应该注意那些点... 如果感兴趣的朋友，可以点击观看我的下篇文章<a href="https://www.duanliang920.com/learn/web/9154.html?isVip=1" target="_blank" rel="noopener">&ldquo;前端监控系统之实战篇&rdquo;</a>。</p>`
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>

