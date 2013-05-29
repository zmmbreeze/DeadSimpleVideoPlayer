HTML5 Video调研结果
=========

## 控制条与全屏幕播放

ios不支持控制条，且点击后直接全屏播放。android浏览器，大部分都支持控制条，点击控制条上的播放按钮会直接播放，点击视频部分或是全屏幕按钮会全屏幕播放（有些浏览器点击视频部分也不一定全屏幕播放）。控制条上的外观也各有不同，播放按钮、进度条、和最大化按钮是几乎都有的，播放状态指示器和音量控制则不一定有。最悲惨的是，如果不默认设置显示控制条，则会永远不显示。故有些浏览器就会不能全屏播放（不包括用使用fullscreen api）。`fullscreen api`目前还在草案阶段，支持情况很差不建议使用。所以android机型目前几乎不支持通过js来激活全屏播放。

## 预览图

ios支持预览图，但是透明图片会被默认加上黑色背景。android有很多特殊情况，UC浏览器、Android Chrome是支持预览图的（且背景色是透明的），但是百度浏览器和默认浏览器则不支持。

## 高宽

如果不设置默认的高宽，ios会自适应初始的高宽。而android浏览器则大多情况下是有个初始高宽，播放后又获取视频真实宽度然后修改自己的高宽，容易导致页面排版变乱。部分android浏览器是等待一段时间后才变成真正的高宽（不需要播放）。情况比较悲观，所以一定要设置默认高宽，避免排版悲剧。

另外有个很重要的bug：在低版本的android浏览器中，高宽如果小到一定程度（例如无法显示所有控制条和播放按钮），则这两个较小的高宽会失效（或显示的很奇怪）。所以在限定一个较小高度时可以用一个外部容器设置高宽并`overflow:hidden`。

## 自动播放

ios不支持自动播放，android上UC浏览器与高版本的默认浏览器是支持自动播放，但是其他浏览器则不支持（包括非最新版的android chrome）。且有些支持的浏览器有很严重的bug：播放之后页面卡死，不显示视频只显示页面。只能点击“撤销”按钮才能回到原来的界面。

## 编码与格式

目前测试的结果中：type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'时在几乎所有的android（版本4以上）和ios上都可以播放的。另外ios的浏览器对提供mp4的serve端有一定要求，一般的静态server是满足不了。这点公司的[bcs平台](http://mailer.bae.baidu.com/service/bcs/upload)可以支持。

## Javascript与事件支持

总体来说ios与android的支持情况各有优劣。使用这些api之前一定要做好feature test，不然很容易导致bug。例如：ios是不支持video.play()来激活播放的，但是它有个特点是即使被其他元素遮住，点击它所在的那个区域也是可以播放的。

## 支持情况

Android 2.3+的默认浏览器基本都支持mp4格式的video标签，但对全屏支持不全，且都无法通过js激活全屏。它还存在一些[bug](http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/)。ios 3.2+的默认浏览器也支持mp4格式的video标签（默认打开即调用默认播放器全屏播放，且无法通过js来播放）。

## 具体方案

按照目前的支持情况，需要针对ios和android做不同的处理。首先用javascript判断浏览器能否播放'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'格式。如果能播放，则显示封面预览图和播放按钮。在ios 3.2+下点击直接全屏幕播放，在android 2.3+下点击进入一个新页面播放。新页面中的播放器框会更大些，且显示播放器默认控制条，方便用户手动最大化。如果浏览器不能播放，则仅仅显示封面图片。

这个方案需要浏览器支持javascript，预估能cover到大多数“高端浏览器（iphone & android）”。这里有一个简单的[demo](http://nodejs.in/DeadSimpleVideoPlayer/)。

## 工具与链接

* [easyhtml5video](http://easyhtml5video.com/) 转换视频格式的工具
* [很多有用的转码工具](http://www.broken-links.com/2010/07/30/encoding-video-for-android/)
* [android版本最新数据](http://www.mobiletmt.com/?p=7875)
* [can I use video](http://caniuse.com/video)
* [video for every body](http://camendesign.com/code/video_for_everybody) 用flash实现的video兼容方案，不过我们不适用

