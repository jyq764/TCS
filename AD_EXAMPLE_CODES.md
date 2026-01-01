# 广告位示例代码

> **重要提示**：以下是示例代码，不能直接产生广告收入。您需要注册相应平台并获取自己的真实代码才能正常工作。

## 1. Google AdSense 示例代码

### 1.1 响应式横幅广告
```html
<!-- 全局脚本（放在<head>中，只需一次） -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID" crossorigin="anonymous"></script>

<!-- 广告单元代码（放在广告位置） -->
<ins class="adsbygoogle" 
     style="display:block"
     data-ad-client="ca-pub-YOUR_CLIENT_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 1.2 固定尺寸横幅广告
```html
<ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-YOUR_CLIENT_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 1.3 移动端横幅广告
```html
<ins class="adsbygoogle"
     style="display:inline-block;width:320px;height:50px"
     data-ad-client="ca-pub-YOUR_CLIENT_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 2. Media.net 示例代码

### 2.1 响应式广告
```html
<!-- 全局脚本 -->
<script async src="https://cdn.media.net/adserving/adsbymedia_net.min.js"></script>

<!-- 广告单元 -->
<div id="8d8832be-1234-4567-890a-bcdef1234567"></div>
<script>
     try {
          window._mNHandle.queue.push(function () {
               window._mNDetails.loadTag("8d8832be-1234-4567-890a-bcdef1234567", "div", {"width":300,"height":250});
          });
     } catch (error) {
          console.error("Media.net ad error:", error);
     }
</script>
```

## 3. Amazon Associates 产品广告

### 3.1 产品链接广告
```html
<a target="_blank" href="https://www.amazon.com/dp/PRODUCT_ASIN?tag=YOUR_ASSOCIATE_TAG">
     <img src="https://m.media-amazon.com/images/I/IMAGE_ID.jpg" alt="产品名称">
     <span>产品名称</span>
</a>
```

### 3.2 响应式广告单元
```html
<script type="text/javascript">
amazon_ad_tag = "YOUR_ASSOCIATE_TAG";
amazon_ad_width = "728";
amazon_ad_height = "90";
</script>
<script type="text/javascript" src="//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1"></script>
```

## 4. 自定义广告位示例

如果您直接与广告主合作，可以使用简单的HTML/CSS广告位：

```html
<div class="custom-ad">
     <a href="https://advertiser-website.com" target="_blank">
          <img src="https://advertiser-website.com/ad-banner.jpg" alt="广告描述">
     </a>
     <p class="ad-disclaimer">广告</p>
</div>
```

CSS样式：
```css
.custom-ad {
     max-width: 728px;
     margin: 20px auto;
     text-align: center;
     border: 1px solid #eee;
     padding: 10px;
     border-radius: 5px;
}

.custom-ad img {
     max-width: 100%;
     height: auto;
}

.ad-disclaimer {
     font-size: 12px;
     color: #666;
     margin: 5px 0 0;
}
```

## 5. 获取真实代码的步骤

### Google AdSense
1. 注册：https://www.google.com/adsense/
2. 验证网站所有权
3. 创建广告单元 → 获取代码

### Media.net
1. 注册：https://www.media.net/
2. 验证网站
3. 创建广告单元 → 获取代码

### Amazon Associates
1. 注册：https://affiliate-program.amazon.com/
2. 审核通过后 → 创建广告链接

## 6. 广告位部署建议

1. **顶部广告**：使用响应式横幅广告（728×90或响应式）
2. **中部广告**：使用响应式矩形广告（300×250或响应式）
3. **底部广告**：使用响应式横幅广告（728×90或响应式）
4. **移动端**：使用移动端优化的广告尺寸（320×50）

## 7. 测试广告是否正常工作

- 注册平台并获取真实代码
- 替换示例代码中的占位符
- 部署到网站
- 等待几小时至几天（广告平台需要时间审核和填充广告）
- 使用浏览器开发者工具检查是否有广告请求错误

> 记住：不要点击自己的广告，这违反广告平台政策！