
(()=>{
const content=window.MUTON_CONTENT;
const copyText=value=>content.copy?.[String(value)]??String(value);
const copyChanges=Object.entries(content.copy||{}).filter(([key,value])=>key!==value).sort((a,b)=>b[0].length-a[0].length);
const copyNodes=new WeakMap();
const root=document.getElementById('muton-storyboard');
let svg=root.querySelector('#muton-stage');
const range=root.querySelector('#muton-range'), play=root.querySelector('#muton-play');
const motion=root.querySelector('#muton-hero-motion');
let motionQueued=false,lastSavedState=null,menuOpen=false,livePageMode=false,detailMode=false,detailKind='project',detailIndex=1,detailSourceProgress=0,detailSourceScroll=0;
const names=['首屏','服务业务','精选作品','直播视觉','关于我','工作路径','核心能力','联系页脚'];
const brandLogoData='data:image/webp;base64,UklGRhYLAABXRUJQVlA4TAkLAAAvtsQkEIcgFkzmL92ZwvzPv0AghRtcogaDIcu2rSp29gFERPDs/nf35lEeDsYiPxH9n4B9wyONBz7ZeH/CgDSIv+d8G8aXtJVyttbaxau11s5StiRw9gjwvfD+gunz3oYpN97a4C3vbbDKewt+W3jIA9m1vUgxH40f13bk4EjTtNSwx6chJ/kWxf1U3q/nHrwg96WG3J9FUr5EW71o9zqiE6yy1LDJgzj48/2JVWn9OqIL7LLUUNNTiJ1vkOwXx+xZHKDGpYY8nsGufIFCVY6rRxiPzGsNe5yfnPz9ixMrR69hPNa1hrrPLinfn1DpYQ3DsctSQ54ytYN//NJIpZdFRqPGtYaa5hU735+i9FPzaGRea8hjVrvy9UmdvrY4Go9/BM67fY7zbp/jlP+OPc5ITv71+yIH/S2jsclaQ93nky6+PvGixz0MxiuuNeQpkyn85NtS6LTmwah5saGmmYTO10ca/a4yFnksNuQxj6x8feJFz7sMxlMWG/YwBzn56TclK33XOBh7XGyoeQbp4vuT6b7mwajbYkOe4l7hje9J5QzzYGRZbXgl30LnC1Q5xzwaT1lsyOJZVr5AlbPMo7GH1YY9eCUnb35JKueZR6Om1YaafUoX36DKmebRyH21IU9xqPD+V+TgXPNwrLLa8ErehM5XKHO2aTj2sNqQxZdN+QolTlfjcNS43LAHP6TS5vsRdT7sMhyZlxtq9iJefIekc8bNAdblhjzFhUKzr0flnIsD7LLc8Erjhca3KHPWyQFqXG7IMtqmfIuCTusSB8i83rCHkaTS9MvROO/TBR7rDXUbJ158j3bOfHOBTZYbssoghdafjdlkoGHMoINoO0pKKYWU0laONoqKC7zic7J+U8OU2z0N3t7UYPWmgt/a4xVHCI1vUuOAeuaAv4/7OQIPH6h5vSGLvU35Jm20Xzd8XPJpj9EH8lhw2IItqRzxzbisXUVwbyhqrXnBU9Yb6mYpXnyXCm1fGQalqC1uXrDH9YasYqZw0PdC1JQWgU05bF1uULcFh1e0ERrfpkLLLcBu7JaY3SDLgkMWC5vybRI1pDtsF0uXIzxlwWELd0nlwK9Fod0rwnpSO8yOsIcFh7rdEy++T6J2msB+6HYuT6jp4bR7j9GOduvxuXbvMdrRbj1Gu4rVGZBVbtg59luRabZiSOlmmDwh92fDe9tojbe2z/HeNlrjrW00J93gFT8lja/UZaZi1Grm9IVVFhyyfGZTvlKJVivGPa0w+MIeVhy28HdycPyXolqpGFi6leIMNa041O1vYudLJTTaZSTIZeTyhswrDlnlj3a6+E5kIyoYO6oNJndYlxxe8XfS+F6dRhJGz0aqP+yy4pD7rzbleyW0WTD+aUMdosYlh00AOejmK5FtdDgoaoLRITIvOdQtdr5a1UbyANnG4RLrkuPsK6EmKnxsJrpPbPL/WaTJ4EQyQfGJV/zvbDdR4WUzsTlFzf+bnSaCG8nE4RV5/GemFir87BaaX2zynerJ6rcp0GJyJFugY+zxK9Vg9du0WbjgqKiF6Bh1+3+sWDg8QbWQPSPLf2OnhehKtlB84yn/iTUDClfFwukce/w/jAarL+gGmnfU9J/c7sxhgO6R+9pxqkP1hUkWkjPbI2CVlaPI6U2P6Z2Cs9FCmAB7+CJps+oIsKsrh+CduryBhTQDavoeOWkNsfuhG/DKFAPNneshkHnpAA4vmuC1qu60x8C6diCpCzt++U6VCW0D1DHYZemAnOP1iG9KNVAGSEmHoMalA9hHOwRfleITQh+CzGsHYh9JN/zhNw9Sx2BdOyDHOC3g21K9AvYx2GTpADYdpODPvyPNQB4FSYfgda4dkDbCFfGC1QmlYRD7ECbXBmC3VwVvWHOnewY5lxzEbks3/P0bsxno7tA1oCw5kMNSC3iFkgF6EyzEobDpigNsaqbgoy9VdCZZwFiI/dumzapzkGbjiniLYCE7U/yDtC9bg1XvgN1CFbxp1ZlmoA8HHGsOYr9LMz7+ynQDlzM02BxA1iUHctzTA16lZoDBlc1C8QDxWnKATW8ouPOVKRZ2V6qF7AKkrTmQ9qkr4W3aLHRX1ELyAahrDlA+cwpep2iB0ZGNFuEF8qKDeP2dZtz9ysBEdeS00P1A1DUHUv+mB7xSzYKKG4EWqyOQvuYAm/5RgUG/tgHSgyoWWNyoJrInQP3utN/fpM3qTVf7rRMI7XdXwsyKS/oYkgkVJwJNBl+QvzqcshdA+dUpmNo5QDHQHgNMsDhxmrjgDJIuOogXqTuMjnIYuAY4n9RpgsGFRJOHOwh90YHUHuFbMcBgTw3U57DbaC50G5s/kLromB4lW9jNbTRYnkOwwd2BQpMKh4B9UUsWurlqIT8HdBsahku0WX1C0iVNLDAaE7WQHsRug10Gk8vI5hRiX9GgFqqxQot4EMEI62CNNhVeQc4VrVlgMCVq4XoSOI2wDFVptPoFlAWtmGimCi3WR5GtMA9UaTV6hk2Xs80EN0ORJvdHgcsK8zCVVjtcQ+yrmdhQMSPdRnwWxQzzIJVms3OQtpihm2A3U2lS8SzEDusIUmn2gnfAsZgVG6xGdtqsDwPVDpuYC512ywSQdSmLRlhNZBrdnkYwxCsZ25R2VWaAeK1kuIywGthpVZ4GqiHyEENy0nLBFCBtJTussMldlVZPPI5gitdmJistq0wCqAtZNMMr3RI7zW7PA4cpsiUTqdP2jmkgr2PoZsgqH5NCu4oHImqLbOm23Gj8wkQQdRnLhqhFPiJFabg8EezWyGsPN4Tjovk0FUhfxUQNkazbX8WqNB0eCbo5kn2PH0lH54ANcwHqIoZii9SzpPCLkPZTabzimaQRfraSU/xNTPvROKaG6SAvYqLGBg8PBccgXu6YD5KOl3h/e3fSlJ8XykQanopcE2uYEUL/dsz5gYnOIzwWpHlpmBOkrmAo06h4LijTypgUsK9gck1Cw5NBn1TFvJB0/cI2iYJHE3RKXWaG2L88IWcraY//LGhT6Hg2SDPSiKlBzu9NyPUim5VC6rnHf5OgM4hPB3lCCZMDylcm5Hrxl5Z+6rnHfw/sEyh4PKjTyZgfNv2yhFwv/qG1n3ru8R8Dp3sdDwh1MhVPALF/T0KuF/9yhJ967vFfQi7nNDwi6VOpeAaQ9hWJ+6n84Cg/9dzjvwKicxseEaRPpOIpAMe3I+6n8sMj/dRzj/8EyK4VPCRIn0bFg0DW70XcT+WNo/3Uc4/PD4djFY8J0idR8SgQr69E3E/lzR781HOPDw/VrY4HBWlTqHgYkPZtiPupNOjFTz33+ORQneryqIA6gYLHAdQvA4168vPRSXepCx4WinsZTwR56YKcDnXB40JW1zTimSDqygVUd7rggSFejvWApwLpSxeqM1XwyCCnWwdsTwaoSxeyKwd8nQmQ1SXd8GyQly4kdUMzHhxCc+gUPB0kXbkgzYke8eiAXZ3RDfYnhNBXLqC4cAieHqS6cggeEaQuXYh9uCvB4fkAqbnRIoacErAvXcCuYxXBvwGQLxeuhEEnhaRLF6QOdAb4PCcgX8NdGcPOCrEvXUBog7QEr2cF5DZUSxh4WpBz7QJSHaAl+D0vINVRtEYMPS+gLF5AONSU1gDPZwbI3gdoWTD4zLDp4gUgn2ZaFvg+NwBh76baHjD+1BD78gVIPvW+Mwe4Pz0AIdfLxFWzwMW5Qdr69TOVpp9rJWGKT+BnyEe7Q9uxBbg5OeBYwn6GVGrrf3S1WraIaT6FX4a0l7O1P2rtLHsK8HV6yPs3DQA=';
const B='#0000e0', L='#0000f0', G='#60f030', W='#f0f0f0', M='#909090', K='#7e7e99';
const brands=['中粮COFCO产业链好产品','东阿阿胶','usmile优选','BMW','康巴赫KONBACH','Midea','MI','DYESOO多燕瘦','周大生CHOW TAISENG','SENG森歌','NATUZZI EDITIONS','ninebot九号','transformers(变形金刚)','vatti华帝','ROBAM老板','RUMDOM朗通','福临门','ZOY中源家居','西湖安保XIHU SECURITY','金夫人','YAZAKI','箴芝堂','西湖投资XIHU INVESTMENT','山乘酿造SHENG CRAFT BEER','CSG科大智能','Casdon凯度','KUKA顾家家居','DE&E德意','SUPOR苏泊尔','BFB','MQ名气','AUPU奥普'];
const jobs=[['2025—2026','BFB巴菲巴食品科技','品牌设计 / 电商视觉负责人'],['2022—2025','浙江思阳广告集团','资深设计师 → 视觉设计主管'],['2021—2022','杭州火石品牌策划','资深品牌设计师'],['2020—2021','杭州金夫人集团','平面 / 品牌设计师']];
const caps=[['品牌视觉体系','BRAND SYSTEMS',['从品牌定位出发，','把标志、色彩与图形','连接成清晰、可延展的识别。'],'六段村 · 标志 / VI / 应用 ↗'],['商业视觉转化','COMMERCIAL VISUALS',['围绕产品与营销场景，','把主视觉、内容与直播','组织成一致的商业表达。'],'老板电器G30 · 新品上市 ↗'],['设计统筹管理','DESIGN MANAGEMENT',['亲自把握关键设计，','也用排期、审核与复盘，','让团队持续交付好作品。'],'思阳 · 团队与交付机制 ↗']];
const specs=[
[['固定导航','高 60px；聊聊合作：白色文字 + 绿色 ↘，点击前往联系页脚'],['MUTON.DES × 3','采用当前字标动画画面；三行错位铺开，位于前景主张后方'],['从品牌识别 / 到商业现场。','两行均 132px / 300；左侧约 40% 宽，下部约 1/3；白字压在蓝字前方'],['字标循环 · 收尾修订版','9.44 秒静默自动循环；无需移动鼠标；文字入场结束后背景持续流动'],['身份信息入场','右下信息统一左对齐至 x=1420；逐行从裁切区下方向上显现；保留当前入场次序'],['探索我的作品 / 背景小字','右下探索入口 22px；下方 Scroll down 去掉箭头并与入口左对齐；三处英文小字 16px，错峰逐字打出，完成后方块光标持续闪烁']],
[['{ REAL SERVICE }','13px；居中，独立留白'],['三行中英文标题','统一 64px；三行居中；前半段随滚动逐词显现，中文完成后再整块显露 Logo'],['品牌 Logo','4 行 × 8 列，整体居中；圆形直径 124px，横向净距 56px、纵向净距 30px；继续下滑时整块淡入上移，静默40%、悬停100%']],
[['{ 我的精选作品 }','28px；灰紫色、轻字重、居中；进入章节时逐字打出'],['三列独立接续','列宽约 30%；边距约 2%；列间距约 3%；不设整齐横向行线；三列以不同延迟跟随滚动，停止后自然归位'],['封面 / 图片','按参考帧约 4:3 为主；每张独立校准；按素材包接入真实封面'],['案例标题','参考帧估算约 30px / 400；1–2 行，轻字重'],['标签 / 简介','估算约 14 / 18px；蓝底分类，灰色说明；行数参与错位'],['SEE ALL PROJECTS','位于精选作品底部；与导航「项目」进入同一个项目索引页']],
[['{ 全场景直播视觉方案 }','28px；与精选作品标题同色、同字重、同位置；逐字打出'],['悬停轮播','机身统一为直播二级页的窄边框、圆角、侧键与金属厚度，比例 9:19；五台手机浅弧排列、逐级缩小；相邻机身留出间隙；悬停沿较短方向移至中央'],['自动展示简介','手机到位后，从机身底部升起蓝黑渐变，覆盖下半部并显示名称与简介；支持键盘聚焦与触屏点选'],['接入关于我','手机退场 → 蓝幕与 BEHIND THE WORK 连续上滑 → 露出关于我，全程不在中央停顿']],
[['{ ABOUT ME } / 设计执行 → 视觉统筹','28 / 13px；左上与右上'],['黑白人像','左侧约 36%；使用已提供人像'],['亲自设计。 / 也让好的设计， / 持续发生。','约 64 / 56 / 48px，右侧三行'],['简介与基本信息','正文 14px；简介已据原始工作介绍替换；年份 / 城市两列'],['与工作路径连接','内容自然上移，下一章接续；不强行占满两个独立屏幕']],
[['工作路径 / EXPERIENCE / 2020–2026','24 / 12px；左右对齐'],['四段经历','全宽横向列表：日期 / 公司 / 岗位 / 加号'],['列表字号','日期 14px；公司 16px / 600；岗位 14px；加号 24px'],['展开详情','14px；原始职责资料；展开撑开布局，下方条目顺移']],
[['滚动版式','1920 × 1080 视窗；分段阅读，在画面内滚动或拖动进度查看'],['π 型能力 / 有深度，也有连接。','两行均为 88px / 300 字重、白色；统一左对齐至 x=180，行距 120px'],['大型 π','低亮度深蓝、黑色网点、局部受光与圆润厚度；暗部及轮廓融入黑底'],['动效顺序','两行同字号标题 → π 从底部显露 → 三项能力左 / 右 / 左依次经过'],['三项能力','灰色小标题 24px；轻字重大文案 50px / 行距 66px；案例线索 22px'],['尾页衔接','黑色前景连同第三项能力上移，逐渐露出位置固定的蓝色联系页']],
[['{ NEXT CHAPTER } / 回到顶部','28 / 13px；顶部两端'],['下一个项目。 / 一起 开始 ↘','64 / 40px；左侧'],['合作说明 / 邮箱','16 / 20px；右侧分区为待确认建议'],['版权 / 职位 / 索取简历','12 / 12 / 13px；大字上方'],["LET’S TALK",'900 字重，满宽黑字；底部位置稳定；黑色前景移开逐渐揭露']]
];
const copies=[
'MUTON.木木其 ｜ 聊聊合作 ↘\n项目 / 直播 / 菜单\nMUTON.DES（完整重复三行）\n从品牌识别\n到商业现场。\n陈其林\n品牌视觉 Design Lead\n用系统建立识别，用创意连接业务。\n从关键视觉主创，到团队与项目统筹。\n探索我的作品 →\nScroll down\nPIONEERING BRAND VISUALS\nFROM IDENTITY TO BUSINESS ON-SITE\nCREATIVE DIRECTION · TEAM LEADERSHIP',
'{ REAL SERVICE }\nLet design take place within\nreal-world business operations.\n让设计发生在真实业务里面\n\n'+brands.join(' / '),
'{ 我的精选作品 }\n12 个精选作品已按素材包顺序接入，同项目共享封面、名称与详情\nSEE ALL PROJECTS →',
'{ 全场景直播视觉方案 }\n'+content.live.map(item=>item.title+'\n'+item.summary).join('\n')+'\nSEE ALL LIVE SCENES →',
'{ ABOUT ME }\n设计执行 → 视觉统筹\n亲自设计。\n也让好的设计，\n持续发生。\n在品牌策划公司、广告集团与消费品牌甲方积累经验，将品牌识别、内容传播和商业场景连接起来。亲自做好关键设计，也让团队的交付持续向前。\n2020—2026 / 品牌与商业视觉实践\n杭州 / 品牌视觉·设计统筹',
'工作路径\nEXPERIENCE / 2020–2026\n\n'+jobs.map(j=>j.join('\n')).join('\n\n')+'\n\n四段职责已依据原始工作介绍核对',
'π 型能力\n有深度，也有连接。\n\n'+caps.map((c,i)=>'0'+(i+1)+' '+c[0]+' / '+c[1]+'\n'+c[2].join('\n')+'\n'+c[3]).join('\n\n'),
"{ NEXT CHAPTER }\n回到顶部 ↑\n下一个项目。\n一起 开始 ↘\n期待品牌视觉与设计管理的工作机会，\n也欢迎品牌全案、商业视觉与产品设计合作。\nmuton2.45@gmail.com ↑\n复制邮箱\n© 2026 陈其林\n品牌视觉 / Design Lead\n联系索取简历 ↑\nLET’S TALK"
];
let chapter=0, p=.65, running=false, raf=0, phone=2, expanded=-1, pointer={x:1570,y:240};
const esc=s=>copyText(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function wrapCopy(value,limit){
 const noStart=/[，。！？；：、）》】」』〕〉〗〙〛’”％‰…,.!?;:%)\]}]/u,noEnd=/[（《【「『〔〈〖〘〚‘“(\[{]/u,word=/[A-Za-z0-9_+./–—-]/u;
 return copyText(value).split('\n').flatMap(paragraph=>{
  const chars=Array.from(paragraph),rows=[];
  const blocked=end=>end<chars.length&&(noStart.test(chars[end])||noEnd.test(chars[end-1])||word.test(chars[end-1])&&word.test(chars[end]));
  for(let start=0;start<chars.length;){
   let end=Math.min(start+limit,chars.length);
   while(end>start&&blocked(end))end--;
   if(end===start){end=Math.min(start+limit,chars.length);while(blocked(end))end++;}
   rows.push(chars.slice(start,end).join('').trim());start=end;
   while(chars[start]===' ')start++;
  }
  return rows;
 });
}
const mediaMarkup=(asset,extra='')=>{
 const preview=extra.includes('stage-screen-media')||extra.includes('data-preview'),source=preview&&asset.preview||asset.src;
 return asset.type==='video'?`<video data-media-src="${source}" ${asset.poster?`data-media-poster="${asset.poster}"`:''} muted loop playsinline preload="none" ${extra}></video>`:`<img data-media-src="${source}" alt="${esc(asset.label)}" ${asset.width&&asset.height?`width="${asset.width}" height="${asset.height}"`:''} decoding="async" ${extra}>`;
};
const observedMedia=new WeakSet();
function playVisibleMedia(video){if(video.dataset.inView==='true'&&!video.controls&&!document.hidden&&!reducedLiveMotion.matches&&video.getAttribute('src'))video.play().catch(()=>{});}
const mediaPlaybackObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 target.dataset.inView=String(isIntersecting);if(isIntersecting)playVisibleMedia(target);else target.pause();
}),{threshold:.1});
const mediaLoadObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(!isIntersecting)return;
 if(target.dataset.mediaPoster){target.poster=target.dataset.mediaPoster;delete target.dataset.mediaPoster;}
 if(target.dataset.mediaSrc){
  const source=target.dataset.mediaSrc;delete target.dataset.mediaSrc;
  target.setAttribute(target.tagName.toLowerCase()==='image'?'href':'src',source);
  if(target.tagName==='VIDEO'){target.preload=target.controls?'metadata':'auto';target.load();playVisibleMedia(target);}
 }
 mediaLoadObserver.unobserve(target);
}),{rootMargin:'400px 0px',threshold:0});
function observeMedia(scope=root){
 const nodes=[...(scope.matches?.('[data-media-src]')?[scope]:[]),...scope.querySelectorAll('[data-media-src]')];
 for(const media of nodes){if(observedMedia.has(media))continue;observedMedia.add(media);mediaLoadObserver.observe(media);if(media.tagName==='VIDEO')mediaPlaybackObserver.observe(media);}
}

const svgImage=(asset,x,y,w,h,extra='')=>`<image data-media-src="${asset.preview||asset.poster||asset.src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" ${extra}/>`;
function detailSections(info,kind){
 const editorial=kind==='live'?content.liveEditorial?.[info.uid]:content.editorial?.[info.uid];
 const curated=kind==='live'?null:content.detailLayouts?.[info.uid];
 const sections=editorial?.sections||curated?.sections||[{title:kind==='live'?'直播画面':'作品展示',layout:kind==='live'?'portrait':'grid',items:info.media.map((_,i)=>i)}];
 const intro=editorial?.intro;
 const copy=(title,paragraphs=[])=>`<div class="md-editorial-copy"><h2>${esc(title)}</h2><div>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></div>`;
 return (intro?`<section class="md-design-section md-editorial-intro">${copy(intro.title,intro.paragraphs)}</section>`:'')+sections.map(section=>{
  if(section.regions){const asset=info.media[section.items[0]];return `<section class="md-design-section" data-layout="analysis">${copy(section.title,section.paragraphs)}<figure class="md-screen-analysis"><div class="md-screen-map">${mediaMarkup(asset,`data-media-index="${section.items[0]}"`)}${section.regions.map(zone=>`<div class="md-zone" style="top:${zone.top}%;height:${zone.height}%"><span>${esc(zone.label)}</span></div>`).join('')}</div><figcaption class="md-figure-note">${esc(section.caption||'基于完整画面的区域分析')}</figcaption></figure></section>`;}
  const media=section.items.map(index=>{
   const asset=info.media[index],width=asset.width||1600;
   return `<figure class="md-real-media" data-media-index="${index}" style="--source-width:${width}px">${mediaMarkup(asset,asset.type==='video'&&!asset.animated?'controls':'')}</figure>`;
  }).join('');
  return `<section class="md-design-section" data-layout="${section.layout}">${copy(section.title,section.paragraphs)}${media?`<div class="md-section-media" style="--section-columns:${section.columns||2};--component-columns:${section.columns||3};--section-width:${section.maxWidth||(section.layout==='hero'?1600:1800)}px;--component-background:${section.background||'#e8e8e6'}">${media}</div>`:''}</section>`;
 }).join('');
}
const jobDescriptions=content.jobs.map(job=>job.paragraphs);

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const text=(x,y,s,size=24,fill=W,extra='')=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const lines=(x,y,arr,size=24,fill=W,gap=size*1.45,extra='')=>arr.map((s,i)=>text(x,y+i*gap,s,size,fill,extra)).join('');
const btn=(x,y,label,w=240)=>rect(x,y,w,44,'#6af03e','rx="4"')+text(x+w/2,y+29,label,15,'#000','font-weight="700" text-anchor="middle"');
function brandLogo(x,y,width,black=false){
 return `<svg x="${x}" y="${y}" width="${width}" height="${width*148/1207}" viewBox="0 0 1207 148" overflow="hidden" role="img" aria-label="MUTON 品牌 Logo" data-brand-logo="${black?'loading':'navigation'}"><image href="${brandLogoData}" width="1207" height="148" style="filter:${black?'brightness(0)':'none'}"/></svg>`;
}
function navArtwork(){return rect(0,0,1920,60,'#000')+brandLogo(38,18,198)+text(270,38,'｜ 聊聊合作',18,W)+text(380,39,'↘',24,G,'data-cooperation-arrow="true"')+['项目','直播','菜单'].map((n,i)=>rect(1580+i*106,13,94,35,'#000',`rx="4" stroke="${G}"`)+text(1627+i*106,37,n,17,G,'text-anchor="middle"')).join('');}
function nav(){return '';}
function defs(){return `<defs><radialGradient id="m-glow"><stop stop-color="#1515ff" stop-opacity=".65"/><stop offset="1" stop-color="#0000e0" stop-opacity="0"/></radialGradient><linearGradient id="m-pi" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="#526ff7"/><stop offset=".35" stop-color="#0606df"/><stop offset=".72" stop-color="#000077"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="m-phone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#00000f"/><stop offset="1" stop-color="#141491"/></linearGradient><pattern id="m-dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#000" opacity=".55"/></pattern><filter id="m-distort" x="-10%" y="-20%" width="120%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".003 .006" numOctaves="1" seed="${Math.floor(p*9)}" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="${25+Math.sin(p*10)*24}"/></filter><clipPath id="m-window">${rect(-1920,0,5760,1080,'#fff')}</clipPath><clipPath id="m-pi-clip"><text x="960" y="1030" text-anchor="middle" font-family="Arial" font-size="720" font-weight="900" textLength="1160" lengthAdjust="spacingAndGlyphs">π</text></clipPath></defs>`;}
// Keep the video outside the SVG so foreground redraws do not restart it.
function revealLine(id,x,y,label,size,fill,start,extra=''){
 const amount=clamp((p*6.5-start)/.7), eased=1-Math.pow(1-amount,3);
 return `<defs><clipPath id="${id}">${rect(0,y-size*1.12,1920,size*1.4,'#fff')}</clipPath></defs><g clip-path="url(#${id})"><g transform="translate(0 ${(1-eased)*size*1.4})">`+text(x,y,label,size,fill,extra)+'</g></g>';
}
const pageLoadDuration=2.7;
function pageLoading(seconds){
 let out='';
 if(seconds<1.45){const frame=Math.floor(seconds*8);out=rect(-1920,0,5760,1080,L);for(let i=0;i<9;i++){if(((i*7+frame*3)%11)<5)out+=rect(918+(i%3)*28,485+Math.floor(i/3)*28,23,23,'#000');}}
 else if(seconds<pageLoadDuration){const t=clamp((seconds-1.45)/1.25);for(let i=0;i<96;i++){const rank=((i*37)%97)/97;if(rank>t)out+=rect(i%12*160,Math.floor(i/12)*135,162,137,L);}}
 if(seconds<1.45)out+=brandLogo(892.5,610,135,true);
 return `<g data-page-loading="true">${out}</g>`;
}
const heroLabels=[['PIONEERING BRAND VISUALS',[[740,280],[550,235],[760,310]]],['FROM IDENTITY TO BUSINESS ON-SITE',[[820,495],[1000,455],[620,530]]],['CREATIVE DIRECTION · TEAM LEADERSHIP',[[1380,165],[1120,180],[1300,135]]]];
let heroTypingStart=performance.now()+3000,heroTypingFrame=0,heroTypingLast=0;
function restartHeroTyping(){heroTypingStart=performance.now()+3000;}
function updateHeroTyping(now){
 heroTypingFrame=requestAnimationFrame(updateHeroTyping);
 if(now-heroTypingLast<65||!siteReady||home.hidden||sections[0].section.getBoundingClientRect().bottom<=0)return;
 heroTypingLast=now;
 heroLabels.forEach(([label,positions],i)=>{
  const group=sections[0].art.querySelector(`[data-typewriter="${i}"]`);if(!group)return;
  const typing=label.length*70,hold=8*800,deleting=label.length*55,period=typing+hold+deleting+700;
  const elapsed=Math.max(0,now-heroTypingStart-i*600),cycle=Math.floor(elapsed/period),t=elapsed%period;
  const n=reducedLiveMotion.matches?label.length:t<typing?Math.floor(t/70):t<typing+hold?label.length:Math.max(0,label.length-Math.floor((t-typing-hold)/55));
  const [x,y]=positions[reducedLiveMotion.matches?0:cycle%positions.length];
  group.setAttribute('transform',`translate(${x} ${y})`);group.dataset.phase=t<typing?'typing':t<typing+hold?'holding':n?'deleting':'empty';
  const letters=group.querySelector('text'),caret=group.querySelector('rect');
  const value=label.slice(0,n);if(letters.textContent!==value)letters.textContent=value;
  caret.setAttribute('x',letters.getComputedTextLength()+6);caret.setAttribute('y',-13);
  caret.setAttribute('opacity',n&&(reducedLiveMotion.matches||t<typing||t>=typing+hold||Math.floor((t-typing)/400)%2===0)?'1':'0');
 });
}
function hero(){
const seconds=p*6.5;
if(seconds<1.45)return pageLoading(seconds);
let out=nav();
out+=revealLine('m-claim-1',42,795,'从品牌识别',132,W,1.95,'font-weight="300" letter-spacing="-5"');
out+=revealLine('m-claim-2',42,947,'到商业现场。',132,W,2.10,'font-weight="300" letter-spacing="-5"');
[['陈其林',799,22,M,2.15],['品牌视觉 Design Lead',830,22,M,2.25],['用系统建立识别，用创意连接业务。',884,24,W,2.35],['从关键视觉主创，到团队与项目统筹。',921,24,W,2.45],['探索我的作品 ↘',985,22,G,2.55],['Scroll down',1030,20,M,2.65]].forEach(([label,y,size,color,start],i)=>{out+=revealLine('m-identity-'+i,1420,y-24,label,size,color,start,'text-anchor="start"');});
heroLabels.forEach(([label],i)=>{out+=`<g data-typewriter="${i}"><text font-size="16" fill="${M}"></text><rect width="7" height="16" fill="${M}" aria-hidden="true"/></g>`;});
return out+pageLoading(seconds);
}
function service(){
 let out=text(960,115,'{ REAL SERVICE }',22,M,'text-anchor="middle"');
 const words=[['Let','design','take','place','within'],['real-world','business','operations.'],['让设计','发生在','真实业务','里面']];
 let count=0,n=Math.floor(clamp(p/.48)*12);
 words.forEach((row,i)=>{out+=`<text x="960" y="${208+i*80}" font-size="64" fill="${W}" text-anchor="middle" data-service-title="${i}">`+row.map((word,j)=>`<tspan opacity="${count++<n?1:0}">${esc(word)+(i<2&&j<row.length-1?' ':'')}</tspan>`).join('')+'</text>';});
 const logoReveal=ease(clamp((p-.54)/.36));
 out+=`<g id="m-logo-matrix" opacity="${logoReveal}" transform="translate(0 ${(1-logoReveal)*110})" style="pointer-events:${logoReveal>.95?'auto':'none'}">`;
 brands.forEach((b,i)=>{const row=Math.floor(i/8),x=330+i%8*180,y=530+row*154;out+=`<g data-logo="${i}" tabindex="0" class="cursor-interaction" aria-label="${esc(b)}"><clipPath id="m-service-logo-${i}"><circle cx="${x}" cy="${y}" r="62"/></clipPath><circle cx="${x}" cy="${y}" r="62" fill="#fff"/><g clip-path="url(#m-service-logo-${i})"><svg x="${x-56}" y="${y-56}" width="112" height="112" viewBox="${i%8*192} ${Math.floor(i/8)*192} 192 192" overflow="hidden"><image data-media-src="${content.logos[i].src}" width="1536" height="768"/></svg></g></g>`;});
 out+='</g>';
 return out;
}
let titleStarted=0,titleRaf=0,workRaf=0,workLast=0;
const workColumns=[0,0,0];
function resetWorkFlow(){cancelAnimationFrame(workRaf);workRaf=0;workLast=performance.now();workColumns.fill(clamp((p-.2)/.8));}
function queueWorkFlow(){
 if(workRaf||menuOpen||projectMode||livePageMode||detailMode)return;
 workRaf=requestAnimationFrame(()=>{workRaf=0;
  const section=sections[2];
  if(home.hidden||section.section.getBoundingClientRect().bottom<0)return;
  advanceWorkFlow(clamp((section.last-.2)/.8));
 });
}
function advanceWorkFlow(target=clamp((p-.2)/.8)){
 const now=performance.now(),dt=Math.min(64,now-workLast);workLast=now;
 workColumns.forEach((value,i)=>{workColumns[i]=reducedLiveMotion.matches?target:value+(target-value)*(1-Math.exp(-dt/[85,200,130][i]));if(Math.abs(workColumns[i]-target)<.0001)workColumns[i]=target;});
 const art=sections[2].art;
 art.querySelectorAll('[data-detail-work]').forEach((node,i)=>node.setAttribute('transform',`translate(0 ${-workColumns[i%3]*2280})`));
 art.querySelector('[data-chapter-title]')?.setAttribute('y',120-workColumns[1]*2280);
 if(workColumns.some(value=>value!==target))queueWorkFlow();
}
function chapterTitle(y,label){
 const count=reducedLiveMotion.matches?100:Math.floor((performance.now()-(sectionTitleTimes[chapter]??-10000))/70);
 return `<text x="960" y="${y}" font-size="28" fill="${K}" text-anchor="middle" aria-label="${esc(label)}" data-chapter-title="true">`+[...label].map((letter,i)=>`<tspan opacity="${i<count?1:0}">${esc(letter)}</tspan>`).join('')+'</text>';
}
function restartTitle(){
 cancelAnimationFrame(titleRaf);titleStarted=performance.now();
 if(chapter!==2&&chapter!==3)return;
 const tick=now=>{
  const count=Math.floor((now-titleStarted)/70);
  svg.querySelectorAll('[data-chapter-title] tspan').forEach((span,i)=>span.setAttribute('opacity',i<count?'1':'0'));
  if(now-titleStarted<1500)titleRaf=requestAnimationFrame(tick);
 };
 titleRaf=requestAnimationFrame(tick);
}
function works(){
 const travel=2280;let out=chapterTitle(120-workColumns[1]*travel,'{ 我的精选作品 }');let ys=[290,337,300],xs=[38,672,1306];
 for(let r=0;r<4;r++)for(let c=0;c<3;c++){
  const id=r*3+c+1,item=content.projects[content.featured[id-1]-1],x=xs[c],y=ys[c],h=[430,446,422,428,443,430,420,460,438,440,452,420][id-1];
  const title=wrapCopy(item.title,18),copy=wrapCopy(item.summary,30),extra=(title.length-1)*36;
  const tag=item.tag||item.category,tagWidth=Math.min(550,24+[...tag].reduce((n,ch)=>n+(/[\u0000-\u00ff]/.test(ch)?8:15),0));
  out+=`<g transform="translate(0 ${-workColumns[c]*travel})" data-detail-work="${id}" data-project-uid="${item.uid}" class="cursor-interaction" tabindex="0" role="link" aria-label="查看${esc(item.title)}">`+svgImage(item.cover,x,y,576,h,`data-work-cover="${id}" data-work-column="${c}"`)+rect(x,y+h+20,tagWidth,29,'#2021bd','data-work-tag="true"')+text(x+12,y+h+40,tag,15,W)+lines(x,y+h+88,title,30,W,36,'font-weight="400" data-work-title')+lines(x,y+h+125+extra,copy,18,M,25,'data-work-copy')+text(x+568,y+h+125+extra+(copy.length-1)*25,'↗',23,G,'text-anchor="end"')+'</g>';
  ys[c]+=h+125+extra+Math.max(copy.length,3)*25+70;
 }
 return `<defs><clipPath id="m-work-window"><rect x="0" y="-1080" width="1920" height="2160"/></clipPath></defs><g clip-path="url(#m-work-window)">${out}</g>`;
}

const phoneNames=content.live.map(item=>item.title);
const liveLayer=root.querySelector('#muton-live-layer');
let rotation=0,turnRaf=0,turning=false,infoPhone=-1,phoneInfoTimer=0;
const ease=t=>t*t*(3-2*t);
liveLayer.innerHTML=phoneNames.map((name,i)=>`<button type="button" class="muton-phone cursor-interaction" data-live-phone="${i}" aria-label="查看${esc(name)}的案例详情" aria-expanded="false"><span class="ml-device-back" aria-hidden="true"></span><span class="ml-device-key" aria-hidden="true"></span><span class="ml-device-key key-lower" aria-hidden="true"></span><span class="ml-device-key key-right" aria-hidden="true"></span><span class="ml-speaker" aria-hidden="true"></span><span class="muton-phone-screen ml-device-screen">${mediaMarkup(content.live[i].cover,'class="stage-screen-media"')}<span class="muton-phone-info" aria-hidden="true"><span class="muton-phone-info-title">${esc(name)}</span><span class="muton-phone-info-copy">${esc(content.live[i].summary)}</span></span></span></button>`).join('');
const phoneButtons=[...liveLayer.querySelectorAll('button')];
function positionPhones(){
 liveLayer.hidden=chapter!==3||p>=.86;
 const exit=ease(clamp((p-.72)/.14));
 liveLayer.style.opacity=1-exit;
 liveLayer.style.transform=`translateY(${-exit*8}%)`;
 liveLayer.style.pointerEvents='none';
 const angle=rotation+(running?ease(clamp((p-.15)/.45))*Math.PI*2/5:0);
 const centered=((Math.round(2-angle/(Math.PI*2/5))%5)+5)%5;
 const revealed=running?(p>=.60&&p<.72?centered:-1):infoPhone;
 phoneButtons.forEach((button,i)=>{
  const theta=(i-2)*Math.PI*2/5+angle;
  const slot=Math.atan2(Math.sin(theta),Math.cos(theta))/(Math.PI*2/5),distance=Math.abs(slot),scale=1-.13*distance;
  const x=960+Math.sign(slot)*(Math.min(distance,1)*350+Math.max(distance-1,0)*320),y=575+distance*15;
  button.style.setProperty('--phone-scale',scale);button.style.width=(700*9/19)*scale/1920*100+'%';button.style.height=700*scale/1080*100+'%';
  button.style.left=x/1920*100+'%';button.style.top=y/1080*100+'%';
  button.style.zIndex=String(Math.round((3-distance)*10));button.style.opacity=(1-.2*distance)*(1-ease(clamp((distance-2)/.5)));
  button.style.pointerEvents=p<.72?'auto':'none';
  button.setAttribute('aria-pressed',String(i===phone));
  const show=i===revealed&&p<.72&&!turning;
  button.classList.toggle('is-revealed',show);button.setAttribute('aria-expanded',String(show));button.querySelector('.muton-phone-info').setAttribute('aria-hidden',String(!show));
 });
}
function clearPhoneInfo(){
 clearTimeout(phoneInfoTimer);infoPhone=-1;
 phoneButtons.forEach(button=>{button.classList.remove('is-revealed');button.setAttribute('aria-expanded','false');button.querySelector('.muton-phone-info').setAttribute('aria-hidden','true');});
}
function revealPhoneInfo(index){
 clearTimeout(phoneInfoTimer);
 phoneInfoTimer=setTimeout(()=>{if(chapter===3&&!projectMode&&!livePageMode&&!detailMode&&!turning&&!running&&phone===index&&p<.72){infoPhone=index;positionPhones();}},140);
}
function rotateTo(index){
 if(turning||running||chapter!==3||p>=.72)return;
 if(infoPhone===index)return;
 clearPhoneInfo();
 phone=index;
 const target=-(index-2)*Math.PI*2/5;
 const delta=Math.atan2(Math.sin(target-rotation),Math.cos(target-rotation));
 if(Math.abs(delta)<.001){revealPhoneInfo(index);return;}
 const from=rotation,start=performance.now();turning=true;
 const tick=now=>{const t=clamp((now-start)/700);rotation=from+delta*ease(t);positionPhones();if(t<1)turnRaf=requestAnimationFrame(tick);else{turning=false;revealPhoneInfo(index);save();}};
 turnRaf=requestAnimationFrame(tick);
}
liveLayer.addEventListener('pointermove',event=>{
 if(event.pointerType==='touch')return;
 const button=event.target.closest('[data-live-phone]');
 if(button)rotateTo(Number(button.dataset.livePhone));
});
phoneButtons.forEach((button,i)=>{
 button.addEventListener('focus',()=>rotateTo(i));
 button.addEventListener('click',()=>openDetail('live',i+1));
});
function live(){
 let out=chapterTitle(115,'{ 全场景直播视觉方案 }');
 // The section's HTML link stays within the visible viewport.
 if(p>.72){
  const t=ease(clamp((p-.72)/.28));
  if(t>=.5)out=about(0);
  const curtainY=1080-2160*t,wordAlpha=ease(clamp((p-.80)/.04));
  const curtain=`<g data-transition="true" transform="translate(0 ${curtainY})">${rect(-1920,0,5760,1080,L)}${text(960,560,'BEHIND THE WORK',156,'#000',`font-weight="300" text-anchor="middle" letter-spacing="-3" opacity="${wordAlpha}" data-transition-title="true"`)}</g>`;
  out=`<g clip-path="url(#m-window)">${out}${curtain}</g>`;
 }
 return out;
}
function about(progress=p){let off=clamp((progress-.65)/.35)*650;return `<g transform="translate(0 ${-off})">`+text(38,130,'{ ABOUT ME }',28,K)+text(1880,130,'设计执行 → 视觉统筹',20,M,'text-anchor="end"')+svgImage(content.portrait,80,225,690,730,'data-about-portrait aria-label="陈其林个人照片"')+text(925,365,'亲自设计',56,W,'font-weight="600" data-about-heading')+text(925,438,'也让好的设计',56,W,'font-weight="600" data-about-heading')+text(925,505,'持续发生。',56,W,'font-weight="600" data-about-heading')+lines(925,608,['在品牌策划公司、广告集团与消费品牌甲方积累经验，','将品牌识别、内容传播和商业场景连接起来。','亲自做好关键设计，也让团队的交付持续向前。'],24,M,43)+rect(925,732,860,1,'#333')+text(925,791,'2020—2026',36)+text(1400,791,'杭州',36)+text(925,832,'品牌与商业视觉实践',22,M)+text(1400,832,'品牌视觉 · 设计统筹',22,M)+'</g>';}
function experience(){
 let out=text(38,150,'工作路径',36,W,'font-weight="600"')+text(1880,150,'EXPERIENCE / 2020–2026',18,M,'text-anchor="end"'),y=255;
 const open=expanded<0?(expanded===-1&&p>.5?0:-1):expanded;
 for(let i=0;i<4;i++){
  const active=i===open,description=content.jobs?.[i]?.paragraphs||jobDescriptions[i];
  out+=`<g data-job="${i}" role="button" tabindex="0" class="cursor-interaction" aria-expanded="${active}">`+rect(350,y-48,1490,112,'#060606')+rect(350,y-48,1490,1,'#282828')+text(530,y+10,jobs[i][0],21,M)+text(750,y+10,jobs[i][1],26,W,'font-weight="600"')+text(1320,y+10,jobs[i][2],21,M)+text(1770,y+10,active?'×':'+',36,G)+'</g>';
  if(active){let offset=72;description.forEach(paragraph=>{const rows=wrapCopy(paragraph,48);out+=lines(750,y+offset,rows,20,M,30,'data-job-description="true"');offset+=rows.length*30+14;});y+=offset-40;}
  y+=132;
 }
 return out;
}
function piShape(y){
 const attrs='text-anchor="middle" font-weight="900" textLength="1500" lengthAdjust="spacingAndGlyphs"';
 const glyph=(fill,extra='')=>text(960,1500,'π',1500,fill,attrs+` stroke="${fill}" stroke-width="65" stroke-linejoin="round" paint-order="stroke" ${extra}`);
 const definitions=`<defs>
 <linearGradient id="m-pi-body" x1="0" y1="0" x2=".85" y2=".7"><stop stop-color="#00000a"/><stop offset=".28" stop-color="#00005f"/><stop offset=".53" stop-color="#0000c8"/><stop offset=".78" stop-color="#000068"/><stop offset="1" stop-color="#000008"/></linearGradient>
 <linearGradient id="m-pi-side" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#000024"/><stop offset=".5" stop-color="#000065"/><stop offset="1" stop-color="#000002"/></linearGradient>
 <pattern id="m-pi-halftone" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="2.35" fill="#000"/></pattern>
 <filter id="m-pi-depth-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.5"/></filter>
 <filter id="m-pi-round-light" x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="90" result="round-height"/>
  <feDiffuseLighting in="round-height" surfaceScale="220" diffuseConstant="1.35" lighting-color="#ffffff" result="diffuse"><feDistantLight azimuth="235" elevation="32"/></feDiffuseLighting>
  <feComposite in="diffuse" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="body-light"/>
  <feSpecularLighting in="round-height" surfaceScale="72" specularConstant=".18" specularExponent="9" lighting-color="#0000d0" result="shine"><feDistantLight azimuth="235" elevation="45"/></feSpecularLighting>
  <feComposite in="body-light" in2="shine" operator="arithmetic" k1="0" k2="1" k3=".35" k4="0" result="lit"/>
  <feComposite in="lit" in2="SourceAlpha" operator="in"/>
 </filter>
 <filter id="m-pi-feather" x="-10%" y="-10%" width="120%" height="120%"><feMorphology operator="erode" radius="5"/><feGaussianBlur stdDeviation="7"/></filter>
 <mask id="m-pi-front-mask" maskUnits="userSpaceOnUse" x="80" y="330" width="1760" height="1400"><g filter="url(#m-pi-feather)">${glyph('#fff')}</g></mask>
 <clipPath id="m-pi-rounded-clip">${glyph('#fff')}</clipPath>
 <linearGradient id="m-pi-floor-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff"/><stop offset="1" stop-color="#555"/></linearGradient>
 <mask id="m-pi-floor-mask" maskUnits="userSpaceOnUse" x="0" y="250" width="1920" height="1500">${rect(0,250,1920,1500,'url(#m-pi-floor-fade)')}</mask>
 </defs>`;
 let depth='';
 for(let i=24;i>=1;i--)depth+=`<g transform="translate(${i*4} ${i*2.4})">${glyph('url(#m-pi-side)')}</g>`;
 const front=`<g mask="url(#m-pi-front-mask)"><g filter="url(#m-pi-round-light)">${glyph('url(#m-pi-body)')}</g>${rect(80,330,1760,1400,'url(#m-pi-halftone)')}</g>`;
 return `<g data-pi="true" transform="translate(0 ${y-580}) scale(1 1.4)">${definitions}<g mask="url(#m-pi-floor-mask)"><g data-pi-depth="true" opacity=".75" filter="url(#m-pi-depth-soft)">${depth}</g><g transform="translate(96 57.6)" mask="url(#m-pi-front-mask)">${rect(80,330,1760,1400,'url(#m-pi-halftone)')}</g>${front}</g></g>`;
}
function capabilityScene(progress){
 const scroll=clamp((progress-.26)/.62)*2350;
 const rise=ease(clamp((progress-.08)/.19));
 let out=`<g data-pi-stage="true" transform="translate(${-scroll*.10} 0)">${piShape((1-rise)*1100-scroll*.28)}</g>`;
 out+=`<g data-capability-heading="true" transform="translate(0 ${-scroll})" opacity="${1-ease(clamp((progress-.28)/.08))}">`;
 out+=text(180,220,'π 型能力',88,W,`font-weight="300" opacity="${ease(clamp(progress/.07))}"`);
 out+=text(180,340,'有深度，也有连接。',88,W,`font-weight="300" opacity="${ease(clamp((progress-.04)/.09))}"`)+'</g>';
 const xs=[180,1030,180],ys=[1230,1990,2700];
 caps.forEach((c,i)=>{
  const y=ys[i]-scroll;
  const a=ease(clamp((1080-y)/200))*ease(clamp((y+240)/220));
  out+=`<g data-capability="${i}" opacity="${a}" transform="translate(${xs[i]} ${y})" style="pointer-events:${a>0?'auto':'none'};paint-order:stroke;stroke:#000;stroke-width:1.2px;stroke-linejoin:round">`;
  out+=text(0,0,'0'+(i+1)+' / '+c[0],24,M)+lines(0,72,c[2],50,W,66,'font-weight="300"')+`<a tabindex="${a>0?0:-1}" href="#${['/case/project/1','/case/project/23','/home/experience'][i]}" aria-label="${esc(c[3])}">${text(0,276,c[3],22,G)}</a>`+'</g>';
 });
 return `<g clip-path="url(#m-window)">${out}</g>`;
}
function capabilities(){return p>.88?footer((p-.88)/.12):capabilityScene(p);}
function contactIcon(kind){
 const shape=kind==='phone'?'<path fill="currentColor" stroke="none" d="M8 6l3 4-2 2c1.2 2.2 2.5 3.5 4.8 4.7l2-2 3.8 3c-1 3-4 3.2-7.8 1C8.5 16.5 5.4 12 5.5 9.5 5.5 7.8 6.3 6.8 8 6Z"/>':'<path fill="currentColor" stroke="none" d="M5 7h14v1l-7 5-7-5Z M5 10l7 5 7-5v7H5Z"/>';
 return `<circle cx="12" cy="12" r="10.5" fill="none"/>${shape}`;
}
function footerContent(){
 return rect(-1920,0,5760,1080,L)+text(38,130,'{ NEXT CHAPTER }',28,'#fff')+text(1880,130,'回到顶部 ↑',20,W,'text-anchor="end"')+text(38,355,'下一个项目。',72,W,'font-weight="700"')+text(38,465,'一起',72,W,'font-weight="700"')+text(204,465,'开始 ↘',72,G,'font-weight="700"')+lines(1000,325,['期待品牌视觉与设计管理的工作机会，','也欢迎品牌全案、商业视觉与产品设计合作。'],26,'#d9e0ff',45,'font-weight="300"')+
 `<svg x="1000" y="421" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${W}" color="${W}" stroke-width="1.2">${contactIcon('phone')}</svg>`+text(1042,445,'17729854302',30,W,'font-weight="300"')+
 `<svg x="1000" y="476" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${W}" color="${W}" stroke-width="1.2">${contactIcon('email')}</svg>`+text(1042,500,'muton2.45@gmail.com',30,W,'font-weight="300"')+
 rect(1000,555,150,48,'none',`rx="4" stroke="${G}"`)+text(1075,587,'复制邮箱',22,G,'text-anchor="middle"')+
 `<image class="contact-qr" data-media-src="assets/contact-wechat.png" x="1470" y="600" width="160" height="160"/><image class="contact-qr" data-media-src="assets/contact-zcool.png" x="1710" y="600" width="160" height="160"/>`+
 text(1550,780,'联系微信',16,W,'text-anchor="middle" font-weight="300"')+text(1790,780,'站酷首页',16,W,'text-anchor="middle" font-weight="300"')+
 text(38,780,'© 2026 陈其林',16,'#d9e0ff','font-weight="300"')+text(900,780,'品牌视觉 / Design Lead',16,'#d9e0ff','font-weight="300"')+text(38,1038,"LET’S TALK",298,'#000','font-weight="900" textLength="1844" lengthAdjust="spacingAndGlyphs"');
}
function footer(progress=p){
 const offset=clamp(progress)*1080;
 return footerContent()+`<g clip-path="url(#m-window)"><g data-footer-foreground="true" transform="translate(0 ${-offset})">${rect(-1920,0,5760,1080,'#000')}${capabilityScene(.88)}</g></g>`;
}
const draws=[hero,service,works,live,about,experience,capabilities,footer];
const statuses=[()=>p*6.5<1.45?'加载方块 → 方块揭幕 → 主张与右下信息分行入场':p*6.5<3.35?'方块揭幕 → 主张与身份信息入场 · 字标开始流动':'三句英文错峰逐字打出 · 背景字标持续自动循环',()=>`随滚动：中英文标题完整呈现 → 继续下滑整块升起至40%；悬停单项完全显现`,()=>`案例浏览进度 ${Math.round(p*100)}% · 三列错峰跟随滚动，停止后缓缓归位`,()=>p>.72?'蓝色幕布 · BEHIND THE WORK → 第五章关于我':'悬停手机 → 转至中央并放大 → 底部渐变自动升起，显示项目名称与简介',()=>p>.65?'关于我自然上移 → 工作路径接续进入':'左右图文分区；人像与个人介绍已替换',()=>p>.5?'展开分镜：详情占据空间，下方条目向下让位':'四段经历完整排列；播放或点击条目查看展开',()=>p<.08?'两行同字号标题逐步显现':p<.28?'深蓝网点 π 从底部显露；可在画面内滚动':p<.48?'第一项：品牌视觉体系 · 左侧':p<.68?'第二项：商业视觉转化 · 右侧':p<.88?'第三项：设计统筹管理 · 左侧':'黑色前景上移 → 露出蓝色联系尾页',()=>p<.95?'黑色前景移开 → 蓝底页脚逐渐揭露；底部大字位置稳定':'页脚完整显露 → 版式静止；左右分区为建议方案'];
function updateCapabilityScene(art,progress){
 const scroll=clamp((progress-.26)/.62)*2350,rise=ease(clamp((progress-.08)/.19));
 art.querySelector('[data-pi-stage]').setAttribute('transform',`translate(${-scroll*.10} 0)`);
 art.querySelector('[data-pi]').setAttribute('transform',`translate(0 ${(1-rise)*1100-scroll*.28-580}) scale(1 1.4)`);
 const heading=art.querySelector('[data-capability-heading]');
 heading.setAttribute('transform',`translate(0 ${-scroll})`);heading.setAttribute('opacity',1-ease(clamp((progress-.28)/.08)));
 heading.children[0].setAttribute('opacity',ease(clamp(progress/.07)));heading.children[1].setAttribute('opacity',ease(clamp((progress-.04)/.09)));
 art.querySelectorAll('[data-capability]').forEach((node,i)=>{const y=[1230,1990,2700][i]-scroll;node.setAttribute('transform',`translate(${[180,1030,180][i]} ${y})`);const alpha=ease(clamp((1080-y)/200))*ease(clamp((y+240)/220));node.setAttribute('opacity',alpha);node.style.pointerEvents=alpha>0?'auto':'none';node.querySelector('a').setAttribute('tabindex',alpha>0?'0':'-1');});
}
function draw(){
 if(chapter===2){
  if(!svg.querySelector('[data-detail-work]'))svg.innerHTML=defs()+works();
  advanceWorkFlow();
 }else if(chapter===6){
  const exiting=p>.88;
  if(svg.dataset.footer!==String(exiting)||!svg.querySelector('[data-pi]')){svg.innerHTML=defs()+capabilities();svg.dataset.footer=String(exiting);}
  if(exiting)svg.querySelector('[data-footer-foreground]').setAttribute('transform',`translate(0 ${-clamp((p-.88)/.12)*1080})`);
  else updateCapabilityScene(svg,p);
 }else svg.innerHTML=defs()+draws[chapter]();
 if(chapter===3)positionPhones();
 projectEntries();
}

function save(){if(siteReady){persistRoute();return;}const state={modelContent:{chapter:menuOpen?'菜单':projectMode?'项目二级页':livePageMode?'直播二级页':detailMode?'案例三级页':names[chapter],category:projectMode?projectCategory:null},privateContent:{detailRevision:2,detailMode,detailKind,detailIndex,detailScrollTop:detailScroll.scrollTop,detailSourceProgress,detailSourceScroll,capabilityRevision:2,chapter,p,phone,menuOpen,projectMode,livePageMode,liveRevision:8,liveScrollTop:liveScroll.scrollTop,projectCategory,projectQuery,projectSelected}};lastSavedState=JSON.stringify(state);if(window.openai?.setWidgetState)window.openai.setWidgetState(state).catch(()=>{});}
function select(i){navigate('/home/'+sectionIds[i]);}

root.querySelector('#muton-chapters').innerHTML=names.map((n,i)=>`<button type="button" class="btn" data-chapter="${i}" aria-pressed="${i===0}">${String(i+1).padStart(2,'0')} ${n}</button>`).join('');
function stop(){if(running&&chapter===3){rotation+=ease(clamp((p-.15)/.45))*Math.PI*2/5;phone=((Math.round(2-rotation/(Math.PI*2/5))%5)+5)%5;}running=false;cancelAnimationFrame(raf);play.textContent=chapter===0?'重播加载与文字入场':'播放分镜';if(chapter===2)queueWorkFlow();}
root.querySelector('#muton-chapters').addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b){stop();select(Number(b.dataset.chapter));save();}});
range.addEventListener('input',()=>{stop();p=Number(range.value)/100;draw();});range.addEventListener('change',save);
play.addEventListener('click',()=>{if(running){stop();save();return;}clearPhoneInfo();cancelAnimationFrame(turnRaf);turning=false;running=true;play.textContent='暂停';p=0;resetWorkFlow();restartTitle();if(chapter===0){motion.pause();motion.currentTime=0;motionQueued=true;}let start=performance.now();const duration=chapter===6?16000:chapter===3?10000:chapter===1?8500:6500;const tick=t=>{p=clamp((t-start)/duration);range.value=Math.round(p*100);draw();if(p<1&&running)raf=requestAnimationFrame(tick);else{stop();save();}};raf=requestAnimationFrame(tick);});
root.addEventListener('pointermove',e=>{const b=svg.getBoundingClientRect();pointer={x:(e.clientX-b.left)/b.width*1920,y:(e.clientY-b.top)/b.height*1080};let circle=svg.querySelector('#muton-glow circle');if(circle){circle.setAttribute('cx',pointer.x);circle.setAttribute('cy',pointer.y);}});
root.addEventListener('click',e=>{const ph=e.target.closest('[data-phone]'),job=e.target.closest('[data-job]');if(ph){phone=Number(ph.dataset.phone);p=.6;range.value=60;draw();save();}if(job){let i=Number(job.dataset.job);expanded=expanded===i?-2:i;p=.3;range.value=30;draw();}});
const projectPage=root.querySelector('#muton-project-page'),projectList=root.querySelector('#muton-project-list'),projectCover=root.querySelector('#muton-project-cover'),projectSearch=root.querySelector('#muton-project-search'),projectCurtain=root.querySelector('#muton-project-curtain');
root.querySelector('#muton-project-nav-art').innerHTML=nav();
const projectEntry=root.querySelector('#muton-project-entry'),allProjectsEntry=root.querySelector('#muton-all-projects');
const projectCategories=[['全部',67],['品牌案例',22],['商业视觉',15],['品牌视觉运营',9],['景观小品和文化墙',5],['产品赋能',12],['企业画册',4]];
const projects=content.projects;
let projectMode=false,projectCategory='全部',projectQuery='',projectSelected=1,routeRaf=0;
const projectTab=document.createElement('button');projectTab.type='button';projectTab.className='btn';projectTab.textContent='项目二级页';projectTab.setAttribute('aria-pressed','false');root.querySelector('#muton-chapters').append(projectTab);
root.querySelector('#muton-project-categories').innerHTML=projectCategories.map(([name,count])=>`<button type="button" class="cursor-interaction" data-project-category="${name}" aria-pressed="${name==='全部'}">${name==='景观小品和文化墙'?'景观小品 / 文化墙':name}<sup>${count}</sup></button>`).join('');
function projectEntries(){
 const loading=chapter===0&&p*6.5<1.45&&!projectMode&&!livePageMode&&!detailMode&&!menuOpen;
 projectEntry.hidden=loading;
 root.querySelector('#muton-live-entry').hidden=loading;
 root.querySelector('#muton-menu-entry').hidden=loading;
 root.querySelector('#muton-contact-entry').hidden=loading;
 allProjectsEntry.hidden=projectMode||livePageMode||detailMode||menuOpen||chapter!==2;
 root.querySelector('#muton-all-live').hidden=projectMode||livePageMode||detailMode||menuOpen||chapter!==3||p>=.72;
 root.querySelector('#muton-home-entry').hidden=loading;
}
function leaveProjects(){
 cancelAnimationFrame(routeRaf);routeRaf=0;projectCurtain.hidden=true;
 projectMode=false;projectPage.hidden=true;projectTab.setAttribute('aria-pressed','false');
 root.querySelector('.muton-product').classList.remove('project-mode');svg.style.visibility='';root.querySelector('.viz-controls').hidden=false;
}
function previewProject(id,animate=true){
 const project=projects.find(item=>item.id===id);if(!project)return;
 projectSelected=id;
 projectList.querySelectorAll('[data-project-id]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.projectId)===id)));
 root.querySelector('#muton-cover-category').textContent=project.category;
 root.querySelector('#muton-cover-number').textContent=project.number;
 root.querySelector('#muton-cover-name').textContent=project.title;
 projectCover.setAttribute('aria-label',project.title+'，项目封面');
 projectCover.style.background='#111';
 let image=projectCover.querySelector('img');if(!image){image=document.createElement('img');image.className='project-real-cover';projectCover.prepend(image);}image.src=project.cover.preview||project.cover.poster||project.cover.src;image.alt=project.title;
 if(animate)projectCover.animate([{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
}
function renderProjects(reset=true){
 const result=projects.filter(item=>(projectCategory==='全部'||item.category===projectCategory)&&item.title.toLowerCase().includes(projectQuery.trim().toLowerCase()));
 if(!result.some(item=>item.id===projectSelected))projectSelected=result[0]?.id??null;
 root.querySelectorAll('[data-project-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.projectCategory===projectCategory)));
 projectList.innerHTML=result.length?result.map((item,index)=>`<button type="button" class="muton-project-row cursor-interaction" data-project-id="${item.id}" aria-pressed="${item.id===projectSelected}" aria-label="查看${esc(item.title)}的案例详情"><span class="muton-project-index">[${String(index+1).padStart(2,'0')}]</span><span class="muton-project-title">${esc(item.title)}</span><span class="muton-project-arrow" aria-hidden="true">↗</span></button>`).join(''):'<p class="muton-project-empty">未找到匹配的项目</p>';
 if(reset)projectList.scrollTop=0;
 projectCover.hidden=!result.length;
 if(projectSelected)previewProject(projectSelected,false);
 root.querySelector('#muton-state').textContent=`项目索引 · ${projectCategory} · 当前 ${result.length} 个案例 · 悬停列表预览，点击进入案例详情`;
}
function showProjectPage(){
 leaveDetail();leaveLivePage();
 projectMode=true;projectPage.hidden=false;motion.pause();motion.hidden=true;liveLayer.hidden=true;svg.style.visibility='hidden';
 const product=root.querySelector('.muton-product');product.classList.add('project-mode');product.style.aspectRatio='16 / 9';
 root.querySelector('.viz-controls').hidden=true;projectTab.setAttribute('aria-pressed','true');root.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed','false'));projectEntries();
 const rows=[['项目索引','约 84px / 300；左侧绿色方块；黑底；尺寸按录屏比例估算'],['分类与数量','全部 67 / 品牌案例 22 / 商业视觉 15 / 品牌视觉运营 9 / 景观小品和文化墙 5 / 产品赋能 12 / 企业画册 4'],['左右布局','列表与预览各占 50%；右侧约 4:3 大图；列表独立滚动'],['项目行','约 52px 轻字重；行高约 158px；蓝色激活行、绿色斜箭头'],['进入动效','复用首页加载：蓝底中央黑色方块变化，下方黑色品牌 Logo；1.45 秒后同序方块揭幕 1.25 秒'],['入口','首页导航「项目」与精选作品「SEE ALL PROJECTS」进入同一页'],['素材状态','67 个项目已按素材目录接入名称、封面与详情；未核实的职责和年份暂不展示']];
 root.querySelector('#muton-specs').innerHTML=rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td></tr>`).join('');
 root.querySelector('#muton-copy').textContent='MUTON.木木其 ｜ 聊聊合作 ↘\n项目 / 直播 / 菜单\n\n项目索引\n'+projectCategories.map(([name,count])=>name+' '+count).join('\n')+'\n搜索项目…\n\n案例名称与封面来自素材包。点击左上角 MUTON.木木其 返回首页。';
 projectSearch.value=projectQuery;renderProjects();
}
function transitionToPage(show){
 if(!projectCurtain.hidden)return;
 stop();clearPhoneInfo();cancelAnimationFrame(turnRaf);turning=false;cancelAnimationFrame(titleRaf);cancelAnimationFrame(workRaf);workRaf=0;
 show();
 if(reducedLiveMotion.matches){save();return;}
 const loading=projectCurtain.querySelector('.muton-route-animation');
 loading.innerHTML=pageLoading(0);projectCurtain.hidden=false;
 const started=performance.now();
 const tick=now=>{
  const seconds=(now-started)/1000;
  loading.innerHTML=pageLoading(seconds);
  if(seconds<pageLoadDuration)routeRaf=requestAnimationFrame(tick);
  else{projectCurtain.hidden=true;routeRaf=0;save();}
 };
 routeRaf=requestAnimationFrame(tick);
}
function openProjects(){navigate('/projects');}

projectEntry.addEventListener('click',openProjects);allProjectsEntry.addEventListener('click',openProjects);projectTab.addEventListener('click',openProjects);
const livePage=root.querySelector('#muton-live-page'),liveScroll=root.querySelector('#muton-live-scroll');
root.querySelector('#muton-live-nav-art').innerHTML=nav();
const livePageTab=document.createElement('button');livePageTab.type='button';livePageTab.className='btn';livePageTab.textContent='直播二级页';livePageTab.id='muton-live-page-tab';livePageTab.setAttribute('aria-pressed','false');root.querySelector('#muton-chapters').append(livePageTab);
const reducedLiveMotion=matchMedia('(prefers-reduced-motion:reduce)');
const liveHero=livePage.querySelector('.ml-hero');
livePage.querySelectorAll('.ml-category').forEach(button=>button.removeAttribute('aria-pressed'));
let liveTypingTimer=0;
livePage.querySelectorAll('[data-live-type]').forEach((element,index)=>{
 const label=element.dataset.liveType;const offset=element.closest('.ml-hero')?index*8:0;
 element.setAttribute('aria-label',label);
 element.innerHTML=[...label].map((char,i)=>`<span class="ml-type-char" aria-hidden="true" style="--char:${i+offset}">${esc(char)}</span>`).join('')+(!element.closest('.ml-hero')?'':`<span class="ml-type-cursor" aria-hidden="true" style="--type-end:${(label.length+offset)*65}ms"></span>`);
});
function startLiveTyping(delay=0){
 clearTimeout(liveTypingTimer);liveHero.classList.remove('is-typing');
 liveTypingTimer=setTimeout(()=>{if(livePageMode)liveHero.classList.add('is-typing');},delay+30);
}
const archiveField=root.querySelector('#muton-live-grid');
const archivePositions=[
 [16,12,1.38,-12],[84,10,.82,13],[47,18,.66,-7],[66,24,1.05,9],[6,34,.72,-16],
 [36,35,1.18,7],[91,38,.60,-9],[58,44,.55,-14],[76,50,1.35,12],[17,55,.82,8],
 [42,60,.65,-10],[60,67,1.17,-7],[94,72,.78,17],[28,79,1.26,-12],[8,87,.66,14],
 [78,89,1.07,-7],[50,94,.48,18],[38,7,.42,16],[96,19,.48,-17],[4,66,.45,-12],
 [52,49,.42,20],[70,7,.40,-8],[27,27,.46,-13],[42,84,.46,10],[84,64,.42,-16]
];
const archiveItems=archivePositions.map((position,i)=>({...content.archive[i],position,name:content.archive[i].title}));
archiveField.innerHTML=archiveItems.map((item,i)=>`<button type="button" class="ml-case cursor-interaction" data-archive-case="${i}" aria-label="查看${esc(item.name)}的展示简介" aria-expanded="false"><span class="ml-case-face">${mediaMarkup(item.cover,'class="stage-screen-media"')}<span class="ml-case-info" aria-hidden="true"><strong>${esc(item.name)}</strong><span>${esc(item.summary)}</span></span></span></button>`).join('');
const archiveButtons=[...archiveField.querySelectorAll('[data-archive-case]')];
let archiveActive=-1,archiveIntent=0,archiveSettle=0,archiveUnlock=0,archiveBusy=false,archiveWidth=0,archiveHeight=0,archivePointer=null;
function placeArchiveCard(index,dx=0,dy=0,scale=null,angle=null){
 const item=archiveItems[index];
 archiveButtons[index].style.transform=`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${scale??item.scale}) rotate(${angle??item.angle}deg)`;
}
function clearArchiveFocus(){
 clearTimeout(archiveIntent);clearTimeout(archiveSettle);clearTimeout(archiveUnlock);archiveBusy=false;archivePointer=null;
 archiveActive=-1;archiveField.classList.remove('has-focus');
 archiveButtons.forEach((button,i)=>{button.classList.remove('is-focused','is-settled');button.setAttribute('aria-expanded','false');button.querySelector('.ml-case-info').setAttribute('aria-hidden','true');if(archiveItems[i].scale!==undefined){button.style.zIndex=String(Math.round(archiveItems[i].scale*20));placeArchiveCard(i);}});
}
function layoutArchive(){
 const width=archiveField.clientWidth,height=liveScroll.clientHeight*2.5;
 if(!width||!height||width===archiveWidth&&height===archiveHeight)return;
 clearArchiveFocus();archiveWidth=width;archiveHeight=height;archiveField.style.height=height+'px';
 const compact=width<600,baseWidth=width*(compact?.34:.115);
 archiveItems.forEach((item,i)=>{
  let [x,y,scale,angle]=item.position;
  if(compact)scale=.58+(scale-.4)*.60;
  const halfW=baseWidth*scale/2,halfH=baseWidth*19/9*scale/2;
  item.x=compact?clamp(x/100*width,halfW+8,width-halfW-8):x/100*width;item.y=clamp(y/100*height,halfH+10,height-halfH-10);item.scale=scale;item.angle=angle;item.baseWidth=baseWidth;
  const button=archiveButtons[i];button.style.setProperty('--card-opacity',String(.5+Math.min(scale,1)*.45));button.style.width=baseWidth+'px';button.style.left=item.x+'px';button.style.top=item.y+'px';button.style.zIndex=String(Math.round(scale*20));placeArchiveCard(i);
 });
}
function focusArchive(index){
 if(index===archiveActive||!livePageMode||menuOpen)return;
 clearArchiveFocus();archiveActive=index;archiveBusy=true;archiveField.classList.add('has-focus');
 const button=archiveButtons[index],item=archiveItems[index],view=liveScroll.getBoundingClientRect(),field=archiveField.getBoundingClientRect();
 const visibleHeight=Math.max(200,Math.min(field.bottom,view.bottom)-Math.max(field.top,view.top));
 const focusHeight=Math.min(view.height*.70,visibleHeight-28,archiveWidth*.60*19/9);
 const focusScale=Math.max(item.scale*1.12,focusHeight/(item.baseWidth*19/9));
 const halfHeight=item.baseWidth*19/9*focusScale/2;
 const centerY=clamp(view.top+view.height*.5-field.top,halfHeight+14,archiveHeight-halfHeight-14);
 archiveButtons.forEach((other,i)=>{other.style.zIndex=String(i===index?100:Math.round(archiveItems[i].scale*20));if(i!==index){const dx=archiveItems[i].x<archiveWidth/2?-5:5;placeArchiveCard(i,dx,0);}});
 button.classList.add('is-focused');button.setAttribute('aria-expanded','true');placeArchiveCard(index,archiveWidth/2-item.x,centerY-item.y,focusScale,0);
 archiveSettle=setTimeout(()=>{if(archiveActive!==index)return;button.classList.add('is-settled');button.querySelector('.ml-case-info').setAttribute('aria-hidden','false');root.querySelector('#muton-live-focus-status').textContent=item.name+'，'+item.kind+'。'+item.summary;},reducedLiveMotion.matches?0:720);
 archiveUnlock=setTimeout(()=>{archiveBusy=false;},reducedLiveMotion.matches?0:900);
}
archiveField.addEventListener('pointermove',event=>{
 if(event.pointerType==='touch')return;
 if(archivePointer&&Math.hypot(event.clientX-archivePointer.x,event.clientY-archivePointer.y)<7)return;
 archivePointer={x:event.clientX,y:event.clientY};
 if(archiveBusy)return;
 clearTimeout(archiveIntent);
 const button=event.target.closest('[data-archive-case]');if(!button)return;
 const index=Number(button.dataset.archiveCase);
 archiveIntent=setTimeout(()=>focusArchive(index),100);
});
archiveField.addEventListener('pointerleave',clearArchiveFocus);
archiveField.addEventListener('click',event=>{const button=event.target.closest('[data-archive-case]');if(!button){clearArchiveFocus();return;}focusArchive(Number(button.dataset.archiveCase));});
archiveField.addEventListener('focusin',event=>{const button=event.target.closest('[data-archive-case]');if(button)focusArchive(Number(button.dataset.archiveCase));});
archiveField.addEventListener('focusout',event=>{if(!archiveField.contains(event.relatedTarget))clearArchiveFocus();});
archiveField.addEventListener('keydown',event=>{if(event.key==='Escape'){clearArchiveFocus();event.preventDefault();}});
liveScroll.addEventListener('scroll',clearArchiveFocus,{passive:true});
new ResizeObserver(()=>{layoutArchive();resizeLiveProcess();}).observe(liveScroll);
let archiveMotionFrame=0,archiveMotionTime=0,archiveLastTime=0;
const archiveFaces=archiveButtons.map(button=>button.querySelector('.ml-case-face'));
const archiveMotionStrength=archiveButtons.map(()=>1);
function animateArchive(time){
 archiveMotionFrame=0;
 if(!livePageMode||!archiveField.classList.contains('is-in-view')||reducedLiveMotion.matches||document.hidden){archiveLastTime=0;return;}
 const dt=archiveLastTime?Math.min((time-archiveLastTime)/1000,.05):0;archiveLastTime=time;archiveMotionTime+=dt;
 const unit=Math.min(archiveWidth/1024,1.5),settle=1-Math.exp(-dt*7);
 archiveFaces.forEach((face,i)=>{
  const target=archiveActive===i?0:archiveActive>=0?.35:1;
  archiveMotionStrength[i]+=(target-archiveMotionStrength[i])*settle;
  const strength=archiveMotionStrength[i],phase=i*2.39996,t=archiveMotionTime*(.28+i%5*.028)+phase;
  const depth=.7+archiveItems[i].scale*.7;
  const x=(Math.sin(t)*42+Math.sin(t*.57+phase)*18)*unit*depth*strength;
  const y=(Math.cos(t*.82)*45+Math.sin(t*.43+phase)*22)*unit*depth*strength;
  const z=Math.sin(t*.68+phase)*26*strength;
  face.style.transform=`perspective(700px) translate3d(${x}px,${y}px,${z}px) rotateX(${Math.sin(t*.72)*7*strength}deg) rotateY(${Math.cos(t*.63)*10*strength}deg) rotateZ(${Math.sin(t*.5)*5*strength}deg)`;
 });
 archiveMotionFrame=requestAnimationFrame(animateArchive);
}
function startArchiveMotion(){if(!archiveMotionFrame)archiveMotionFrame=requestAnimationFrame(animateArchive);}
const archiveVisibility=new IntersectionObserver(entries=>entries.forEach(entry=>{archiveField.classList.toggle('is-in-view',entry.isIntersecting);if(entry.isIntersecting)startArchiveMotion();}),{root:liveScroll,threshold:.01});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)startArchiveMotion();});
reducedLiveMotion.addEventListener('change',()=>{if(reducedLiveMotion.matches)archiveFaces.forEach(face=>face.style.transform='none');else startArchiveMotion();});
archiveVisibility.observe(archiveField);
const processSection=livePage.querySelector('.ml-process'),processPin=livePage.querySelector('.ml-process-pin'),processWords=livePage.querySelector('.ml-process-words'),processTiles=root.querySelector('#ml-process-tiles'),galleryTitle=root.querySelector('#ml-gallery-title');
const liveFooter=livePage.querySelector('.ml-footer'),liveFooterBody=livePage.querySelector('.ml-footer-body');
const serviceRows=[...livePage.querySelectorAll('[data-live-service]')];
const readLines=[...livePage.querySelectorAll('.ml-read-line')];
const readLength=readLines.reduce((sum,line)=>sum+line.firstElementChild.textContent.length,0);
let processWipe=0,processRaf=0,processSize='',processTileData=[];
function resizeLiveProcess(){
 const width=liveScroll.clientWidth,height=liveScroll.clientHeight;
 if(!width||!height)return;
 livePage.style.setProperty('--ml-view-height',height+'px');
 const size=width+','+height;
 if(size!==processSize){
  processSize=size;const columns=width<600?5:7,cell=width/columns,rows=Math.ceil(height/cell),count=columns*rows;
  processTiles.setAttribute('viewBox',`0 0 ${width} ${height}`);
  processTileData=Array.from({length:count},(_,i)=>({x:i%columns*cell,y:Math.floor(i/columns)*cell,cell,rank:(i*17%count)/count}));
  processTiles.innerHTML=processTileData.map(tile=>`<rect x="${tile.x}" y="${tile.y}" width="${cell+1}" height="${cell+1}" fill="currentColor"/>`).join('');
 }
 updateLiveProcess();
}
function updateLiveProcess(){
 processRaf=0;if(!livePageMode)return;
 const height=liveScroll.clientHeight,view=liveScroll.getBoundingClientRect();
 const footerBox=liveFooter.getBoundingClientRect(),footerOffset=clamp(footerBox.bottom-view.bottom,0,footerBox.height);
 liveFooterBody.style.transform=`translateY(${-footerOffset}px)`;
 liveFooter.dataset.revealProgress=clamp(1-footerOffset/footerBox.height).toFixed(3);
 serviceRows.forEach(row=>{
  const shift=Number(row.dataset.revealShift)||0;
  const top=row.getBoundingClientRect().top-view.top-shift;
  const progress=reducedLiveMotion.matches?1:clamp((height*.92-top)/(height*.42));
  const dy=(1-ease(progress))*Math.min(60,height*.12);
  row.style.opacity=String(progress);row.style.transform=`translateY(${dy}px)`;row.dataset.revealShift=dy;row.dataset.revealProgress=progress.toFixed(3);
 });
 const offset=view.top-processSection.getBoundingClientRect().top;
 const reduced=reducedLiveMotion.matches;
 const read=reduced?1:clamp((offset/height+.10)/1.02);
 const blue=reduced?1:ease(clamp((offset/height-.06)/1.08));
 processTiles.style.color=`rgb(0 0 ${Math.round(240*blue)})`;
 processSection.dataset.blueProgress=blue.toFixed(3);
 const lift=reduced?0:clamp(offset-height*1.4,0,height*.9);
 processWipe=reduced?0:clamp((offset/height-1.4)/.9);
 processSection.dataset.readProgress=read.toFixed(3);processSection.dataset.wipeProgress=processWipe.toFixed(3);
 processPin.style.transform=`translateY(${lift}px)`;
 processPin.style.visibility=processWipe>=1?'hidden':'visible';
 livePage.style.setProperty('--process-lift',lift+'px');
 processWords.style.opacity=reduced?'1':String(1-clamp((offset/height-1.18)/.22));
 let before=0;readLines.forEach(line=>{const length=line.firstElementChild.textContent.length;const amount=clamp((read*readLength-before)/length);line.querySelector('.ml-read-white').style.clipPath=`inset(0 ${(1-amount)*100}% 0 0)`;before+=length;});
 [...processTiles.children].forEach((tile,i)=>{
  const data=processTileData[i],progress=clamp((processWipe-data.rank*.72)/.28),scale=1-ease(progress),cx=data.x+data.cell/2,cy=data.y+data.cell/2;
  tile.setAttribute('transform',`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`);
 });
 if((processWipe>.4||reduced)&&galleryTitle.classList.contains('is-visible'))galleryTitle.classList.add('is-typing');
}
function queueLiveProcess(){if(!processRaf)processRaf=requestAnimationFrame(updateLiveProcess);}
liveScroll.addEventListener('scroll',queueLiveProcess,{passive:true});
reducedLiveMotion.addEventListener('change',resizeLiveProcess);
const liveObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.hasAttribute('data-live-scroll-type'))entry.target.classList.add('is-typing');if(entry.target.hasAttribute('data-live-gallery-title')&&(reducedLiveMotion.matches||processWipe>.4))entry.target.classList.add('is-typing');}else if(entry.target.hasAttribute('data-live-assembly-caption'))entry.target.classList.remove('is-typing');});
},{root:liveScroll,threshold:.12});
livePage.querySelectorAll('[data-live-reveal],[data-live-gallery-title],[data-live-scroll-type]').forEach(element=>liveObserver.observe(element));
const liveAssembly=livePage.querySelector('[data-live-assembly]');
const assemblyPhone=liveAssembly.querySelector('.ml-assembly-phone'),assemblySection=liveAssembly.closest('.ml-system');
let assemblyMotionRaf=0,assemblyMotionStart=0,assemblyLastTime=0,assemblyAimX=0,assemblyAimY=0,assemblyMouseX=0,assemblyMouseY=0;
function stopAssemblyMotion(){cancelAnimationFrame(assemblyMotionRaf);assemblyMotionRaf=0;assemblyLastTime=0;assemblyAimX=assemblyAimY=assemblyMouseX=assemblyMouseY=0;assemblyPhone.style.transform='';}
function animateAssembly(now){
 assemblyMotionRaf=0;
 if(!livePageMode||!liveAssembly.classList.contains('is-visible')||document.hidden||reducedLiveMotion.matches)return;
 const dt=Math.min(64,assemblyLastTime?now-assemblyLastTime:16);assemblyLastTime=now;
 const smooth=1-Math.exp(-dt/180);assemblyMouseX+=(assemblyAimX-assemblyMouseX)*smooth;assemblyMouseY+=(assemblyAimY-assemblyMouseY)*smooth;
 const elapsed=(now-assemblyMotionStart)/1000,ramp=ease(clamp((elapsed-1.45)/.8)),t=Math.max(0,elapsed-1.45);
 const x=Math.sin(t*.61)*3*ramp,y=Math.sin(t*.84)*5*ramp,rx=(Math.sin(t*.48)*1.2-assemblyMouseY*3)*ramp,ry=-5+(Math.sin(t*.67)*2.3+assemblyMouseX*7)*ramp,rz=Math.sin(t*.52)*.6*ramp;
 assemblyPhone.style.transform=`translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg)`;
 assemblyMotionRaf=requestAnimationFrame(animateAssembly);
}
function startAssemblyMotion(){if(!assemblyMotionRaf&&livePageMode&&!document.hidden&&!reducedLiveMotion.matches&&liveAssembly.classList.contains('is-visible'))assemblyMotionRaf=requestAnimationFrame(animateAssembly);}
assemblySection.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const box=assemblySection.getBoundingClientRect();assemblyAimX=clamp((event.clientX-box.left)/box.width*2-1,-1,1);assemblyAimY=clamp((event.clientY-box.top)/box.height*2-1,-1,1);});
assemblySection.addEventListener('pointerleave',()=>{assemblyAimX=assemblyAimY=0;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(assemblyMotionRaf);assemblyMotionRaf=0;assemblyLastTime=0;}else startAssemblyMotion();});
reducedLiveMotion.addEventListener('change',()=>{if(reducedLiveMotion.matches)stopAssemblyMotion();else{assemblyMotionStart=performance.now()-2250;startAssemblyMotion();}});

const assemblyObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting&&entry.intersectionRatio>=.45){if(!entry.target.classList.contains('is-visible'))assemblyMotionStart=performance.now();entry.target.classList.add('is-visible');startAssemblyMotion();}
  else if(!entry.isIntersecting){entry.target.classList.remove('is-visible');stopAssemblyMotion();}
 });
},{root:liveScroll,rootMargin:'0px 0px -12% 0px',threshold:[0,.45]});
assemblyObserver.observe(liveAssembly);
let liveSaveTimer=0;
liveScroll.addEventListener('scroll',()=>{clearTimeout(liveSaveTimer);liveSaveTimer=setTimeout(()=>{if(livePageMode&&!menuOpen)save();},240);},{passive:true});
function leaveLivePage(){
 stopAssemblyMotion();liveAssembly.classList.remove('is-visible');liveAssembly.querySelector('[data-live-assembly-caption]').classList.remove('is-typing');
 clearTimeout(liveTypingTimer);clearArchiveFocus();cancelAnimationFrame(archiveMotionFrame);archiveMotionFrame=0;archiveLastTime=0;
 clearTimeout(liveSaveTimer);livePageMode=false;livePage.hidden=true;livePageTab.setAttribute('aria-pressed','false');
 root.querySelector('.muton-product').classList.remove('live-page-mode');
}
function showLivePage(typingDelay=0){
 leaveDetail();leaveProjects();livePageMode=true;livePage.hidden=false;motion.pause();motion.hidden=true;liveLayer.hidden=true;svg.style.visibility='hidden';
 const product=root.querySelector('.muton-product');product.classList.add('live-page-mode');product.style.aspectRatio='16 / 9';
 root.querySelector('.viz-controls').hidden=true;livePageTab.setAttribute('aria-pressed','true');root.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed','false'));projectEntries();
 const rows=[['二级页入口','顶部「直播」、首页「SEE ALL LIVE SCENES」、菜单「直播视觉」进入同一独立页面'],['共用导航与加载','沿用首页导航、品牌 Logo 与蓝底黑色方块加载；Logo 返回首页动态封面'],['首屏','从一个产品 / 到一套直播视觉系统。标题与说明逐行上移揭露；案例入口靠近分类区；八类业务用紧凑高度的圆角描边框，悬停仅描边变为全站亮绿，文字保持默认；小英文逐字打出'],['服务范围','覆盖每个触点 / 构建完整直播视觉。章节小英文逐字出现；四项服务纵向排列于右侧约三分之二区域，随滚动依次上移显现'],['模块化与流程','章节小英文逐字出现；手机进入可视区域后从右侧移入并渐显，离开后再次进入可重播；到位后窄边框立体机身缓慢浮动，鼠标左右移动带动轻微偏转，离开平滑回正；下方模块标签逐字出现，保留模块组合；纯黑背景连贯进入总结；总结先呈黑底与少量白字，随滚动背景渐变为蓝色、白字继续展开，文字淡出后蓝色大方块错峰撤开，露出案例展场'],['案例区','25 张圆角卡片，统一 9:19；约两屏椭圆形展场；四角留白、大小明暗分层、上下左右漂浮、前后倾转。悬停或点选移至可视区域中央、等比放大后升起简介'],['联系尾页','压缩为短版蓝底尾页，仅保留项目邀约与 LET’S TALK；延续滚动揭幕'],['层级边界','本页案例只作互动展示，不跳转详情；首页五个精选案例进入统一三级详情模板'],['文字依据','2026 案例集：夏日冲刺大促；2025 作品集第 17 页：三层组件；个人工作档案：绿幕、贴片、现场物料与交付流程']];
 root.querySelector('#muton-specs').innerHTML=rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td></tr>`).join('');
 layoutArchive();resizeLiveProcess();startArchiveMotion();startLiveTyping(typingDelay);
 root.querySelector('#muton-copy').textContent=liveScroll.textContent;
 root.querySelector('#muton-state').textContent='直播二级页 · 在画面内向下滚动：多元品类 → 全场景系统 → 模块化搭建 → 三行总结 → 漂浮案例展场';
}
function openLivePage(){navigate('/live');}

livePageTab.addEventListener('click',openLivePage);
livePage.querySelector('[data-live-gallery]').addEventListener('click',()=>{
 const gallery=root.querySelector('#muton-live-gallery');
 const lift=parseFloat(livePage.style.getPropertyValue('--process-lift'))||0;
 const target=gallery.getBoundingClientRect().top-liveScroll.getBoundingClientRect().top+liveScroll.scrollTop-lift+(reducedLiveMotion.matches?0:liveScroll.clientHeight*.9+2);
 liveScroll.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
});
root.querySelector('#muton-live-contact').addEventListener('click',()=>{stop();select(7);save();});
const menu=root.querySelector('#muton-menu'),menuEntry=root.querySelector('#muton-menu-entry');
root.querySelector('#muton-menu-nav-art').innerHTML=nav();
const menuTab=document.createElement('button');menuTab.type='button';menuTab.className='btn';menuTab.textContent='菜单';menuTab.id='muton-menu-tab';menuTab.setAttribute('aria-pressed','false');root.querySelector('#muton-chapters').append(menuTab);
let menuMeta=null;
function openMenu(){
 if(menuOpen)return;
 clearArchiveFocus();
 stop();cancelAnimationFrame(workRaf);workRaf=0;clearPhoneInfo();cancelAnimationFrame(turnRaf);turning=false;
 if(chapter===3&&!projectMode&&!livePageMode&&!detailMode){rotation=-(phone-2)*Math.PI*2/5;positionPhones();}
 menuMeta={specs:root.querySelector('#muton-specs').innerHTML,copy:root.querySelector('#muton-copy').textContent,state:root.querySelector('#muton-state').textContent};
 menuOpen=true;menu.hidden=false;document.body.classList.add('menu-open');setBackgroundInert(true);root.querySelector('.muton-product').classList.add('menu-mode');root.querySelector('.viz-controls').hidden=true;
 menuEntry.setAttribute('aria-expanded','true');menuEntry.setAttribute('aria-label','关闭菜单');menuTab.setAttribute('aria-pressed','true');projectEntries();
 root.querySelector('#muton-specs').innerHTML=[['菜单版式','沿用第一版：蓝色满屏、左侧大字导航、右侧个人信息；顶部保持全站统一导航'],['页面入口','项目 → 项目索引；直播视觉 → 直播二级页；关于我 / π 型能力 / 联系 → 首页章节'],['章节快捷入口','首页 / 服务业务 / 精选作品 / 工作路径'],['交互','悬停变绿并浮现箭头；点击进入；再次点菜单、关闭或 Escape 返回']].map(r=>`<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('');
 root.querySelector('#muton-copy').textContent='项目 / 直播视觉 / 关于我 / π 型能力 / 联系\n首页 / 服务业务 / 精选作品 / 工作路径\n\n陈其林\n品牌视觉 / Design Lead\n品牌视觉体系 / 商业视觉转化 / 设计统筹管理\nmuton2.45@gmail.com\n从品牌识别，到商业现场。';
 root.querySelector('#muton-state').textContent='全站菜单 · 点击选项前往对应页面或章节';
 menu.querySelector('button').focus({preventScroll:true});
}
function closeMenu(returnFocus=true){
 if(!menuOpen)return;
 menuOpen=false;menu.hidden=true;document.body.classList.remove('menu-open');setBackgroundInert(false);root.querySelector('.muton-product').classList.remove('menu-mode');root.querySelector('.viz-controls').hidden=projectMode||livePageMode||detailMode;
 menuEntry.setAttribute('aria-expanded','false');menuEntry.setAttribute('aria-label','打开菜单');menuTab.setAttribute('aria-pressed','false');
 if(menuMeta){root.querySelector('#muton-specs').innerHTML=menuMeta.specs;root.querySelector('#muton-copy').textContent=menuMeta.copy;root.querySelector('#muton-state').textContent=menuMeta.state;}
 projectEntries();if(returnFocus){menuEntry.focus({preventScroll:true});if(chapter===3&&!projectMode&&!livePageMode&&!detailMode)revealPhoneInfo(phone);}
}
function toggleMenu(){if(menuOpen)closeMenu();else openMenu();save();}
menuEntry.addEventListener('click',toggleMenu);menuTab.addEventListener('click',toggleMenu);
root.querySelector('#muton-menu-close').addEventListener('click',()=>{closeMenu();save();});
root.querySelector('#muton-live-entry').addEventListener('click',openLivePage);
root.querySelector('#muton-all-live').addEventListener('click',openLivePage);
root.querySelector('#muton-contact-entry').addEventListener('click',()=>{stop();select(7);save();});
menu.addEventListener('click',event=>{
 const button=event.target.closest('[data-menu-chapter],[data-menu-project],[data-menu-live]');if(!button)return;
 if(button.hasAttribute('data-menu-project'))openProjects();
 else if(button.hasAttribute('data-menu-live'))openLivePage();
 else{stop();select(Number(button.dataset.menuChapter));save();}
});
root.addEventListener('keydown',event=>{
 if(!menuOpen)return;
 if(event.key==='Escape'){event.preventDefault();closeMenu();save();}
 if(event.key==='Tab'){
  const controls=[menuEntry,...menu.querySelectorAll('button')],index=controls.indexOf(document.activeElement);
  event.preventDefault();controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();
 }
});
root.querySelector('#muton-home-entry').addEventListener('click',()=>{navigate('/home/top');transitionToPage(()=>{});replayHeroEntrance();});
root.querySelector('#muton-project-categories').addEventListener('click',event=>{const button=event.target.closest('[data-project-category]');if(!button)return;projectCategory=button.dataset.projectCategory;projectQuery='';projectSearch.value='';projectSelected=null;renderProjects();save();});
projectSearch.addEventListener('input',()=>{projectQuery=projectSearch.value;renderProjects();save();});
function projectHighlight(event){const button=event.target.closest('[data-project-id]');if(!button)return;const id=Number(button.dataset.projectId);if(id!==projectSelected){previewProject(id);save();}}
projectList.addEventListener('pointerover',projectHighlight);projectList.addEventListener('focusin',projectHighlight);projectList.addEventListener('click',event=>{const button=event.target.closest('[data-project-id]');if(button)openDetail('project',Number(button.dataset.projectId));});
const detailPage=root.querySelector('#muton-detail-page'),detailScroll=root.querySelector('#muton-detail-scroll');
root.querySelector('#muton-detail-nav-art').innerHTML=nav();
const detailTab=document.createElement('button');detailTab.type='button';detailTab.className='btn';detailTab.id='muton-detail-tab';detailTab.textContent='案例三级页';detailTab.setAttribute('aria-pressed','false');root.querySelector('#muton-chapters').append(detailTab);
let detailSaveTimer=0;
const detailCanvas=root.querySelector('#md-cover-canvas'),detailReveal=root.querySelector('.md-cover-reveal');
let detailWaveRaf=0,detailWaveStart=0,detailWaveDraw=()=>{};
const detailGL=detailCanvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
let detailTexture,detailMedia=null,detailCoverRatio=4/3,detailCoverRequest=0;
if(detailGL){
 const gl=detailGL,program=gl.createProgram();
 const shaders=[[gl.VERTEX_SHADER,`attribute vec2 a;uniform float t;uniform float motion;uniform vec2 fit;varying vec2 uv;
 void main(){uv=a;vec2 p=a*2.-1.;float w=sin(a.y*4.5+t*.72+a.x*2.2);float q=sin(a.x*5.4-t*.58+a.y*1.8);p.x+=motion*(w*.020+sin(t*.43)*.009);p.y+=motion*(q*.027+sin(a.y*3.2+t*.6)*.008);gl_Position=vec4(p*.952*fit,0.,1.);}`],[gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 uv;uniform sampler2D cover;void main(){gl_FragColor=texture2D(cover,vec2(uv.x,1.-uv.y));}`]];
 for(const [type,source] of shaders){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);gl.attachShader(program,shader);}
 gl.linkProgram(program);gl.useProgram(program);
 const vertices=[];for(let y=0;y<24;y++)for(let x=0;x<40;x++){const a=x/40,b=y/24,c=(x+1)/40,d=(y+1)/24;vertices.push(a,b,c,b,a,d,a,d,c,b,c,d);}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
 const at=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
 detailTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,detailTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const time=gl.getUniformLocation(program,'t'),motion=gl.getUniformLocation(program,'motion'),fit=gl.getUniformLocation(program,'fit');
 detailWaveDraw=t=>{const box=detailCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);if(!w||!h)return;if(detailCanvas.width!==w||detailCanvas.height!==h){detailCanvas.width=w;detailCanvas.height=h;}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);if(detailMedia?.tagName==='VIDEO'&&detailMedia.readyState>=2){gl.bindTexture(gl.TEXTURE_2D,detailTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,detailMedia);}gl.uniform2f(fit,Math.min(1,detailCoverRatio/(w/h)),Math.min(1,(w/h)/detailCoverRatio));gl.uniform1f(time,t);gl.uniform1f(motion,reducedLiveMotion.matches?0:1);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);};
}
function paintDetailCover(kind,index){
 const info=detailInfo(kind,index),token=++detailCoverRequest;
 if(detailMedia?.tagName==='VIDEO')detailMedia.pause();
 detailMedia=null;detailCanvas.dataset.loaded='false';
 detailCanvas.setAttribute('aria-label',info.title+'，与入口共用封面，持续轻微波浪形变');
 detailCanvas.dataset.source=info.cover.src;
 if(detailGL){detailGL.bindTexture(detailGL.TEXTURE_2D,detailTexture);detailGL.texImage2D(detailGL.TEXTURE_2D,0,detailGL.RGBA,1,1,0,detailGL.RGBA,detailGL.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));}
 const media=info.cover.type==='video'?document.createElement('video'):new Image();
 if(info.cover.type==='video'){media.muted=true;media.loop=true;media.playsInline=true;media.preload='auto';}
 const loaded=()=>{
  if(token!==detailCoverRequest||!detailMode)return;
  detailMedia=media;detailCoverRatio=(media.videoWidth||media.naturalWidth)/(media.videoHeight||media.naturalHeight);
  if(detailGL){detailGL.bindTexture(detailGL.TEXTURE_2D,detailTexture);detailGL.texImage2D(detailGL.TEXTURE_2D,0,detailGL.RGBA,detailGL.RGBA,detailGL.UNSIGNED_BYTE,media);}else{const ctx=detailCanvas.getContext('2d');detailCanvas.width=media.videoWidth||media.naturalWidth;detailCanvas.height=media.videoHeight||media.naturalHeight;ctx.drawImage(media,0,0);}
  detailCanvas.dataset.loaded='true';if(media.tagName==='VIDEO'&&!reducedLiveMotion.matches)media.play().catch(()=>{});runDetailWave();
 };
 media.addEventListener(info.cover.type==='video'?'loadeddata':'load',loaded,{once:true});media.src=info.cover.src;
}

function runDetailWave(){
 cancelAnimationFrame(detailWaveRaf);detailWaveRaf=0;
 const visible=detailMode&&!document.hidden&&detailScroll.scrollTop<root.querySelector('.md-hero').offsetHeight;
 if(detailMedia?.tagName==='VIDEO'){if(visible&&!reducedLiveMotion.matches){if(detailMedia.paused)detailMedia.play().catch(()=>{});}else detailMedia.pause();}
 if(!visible)return;
 if(detailScroll.scrollTop<root.querySelector('.md-hero').offsetHeight){detailWaveDraw((performance.now()-detailWaveStart)/1000);if(!reducedLiveMotion.matches)detailWaveRaf=requestAnimationFrame(runDetailWave);}
}
function revealDetail(info,kind,index,delay){
 const parts=info.titleLines||info.title.split(' · '),title=root.querySelector('#md-title');
 title.innerHTML=parts.map(part=>`<span><b>${esc(part)}</b></span>`).join('');
 paintDetailCover(kind,index);detailWaveStart=performance.now();runDetailWave();detailReveal.replaceChildren();
 if(reducedLiveMotion.matches)return;
 for(let i=0;i<54;i++){const tile=document.createElement('i');detailReveal.append(tile);const lag=((i*17)%13)*22;tile.animate([{opacity:1},{opacity:0}],{duration:280,delay:Math.max(0,delay-380)+lag,easing:'ease-out',fill:'both'});}
 title.querySelectorAll('b').forEach((line,i)=>line.animate([{transform:'translateY(112%)'},{transform:'translateY(0)'}],{duration:950,delay:delay+80+i*95,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
 root.querySelector('.md-hero-meta').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:delay+330,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
}
detailScroll.addEventListener('scroll',runDetailWave,{passive:true});
document.addEventListener('visibilitychange',runDetailWave);
new ResizeObserver(()=>{if(detailMode)runDetailWave();}).observe(detailCanvas);
reducedLiveMotion.addEventListener('change',runDetailWave);

function detailInfo(kind,index){
 const item=kind==='live'?content.live[index-1]:projects[kind==='work'?content.featured[index-1]-1:index-1];
 return {...item,count:kind==='live'?5:kind==='work'?12:projects.length};
}

function leaveDetail(){
 if(!detailMode)return;
 ++detailCoverRequest;if(detailMedia?.tagName==='VIDEO')detailMedia.pause();detailMedia=null;
 cancelAnimationFrame(detailWaveRaf);detailWaveRaf=0;clearTimeout(detailSaveTimer);detailPage.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
 detailMode=false;detailPage.hidden=true;detailTab.setAttribute('aria-pressed','false');root.querySelector('.muton-product').classList.remove('detail-mode');svg.style.visibility='';
}
function showDetail(kind='project',index=1,delay=0){
 leaveProjects();leaveLivePage();leaveDetail();detailKind=kind;detailIndex=index;detailMode=true;
 detailPage.hidden=false;motion.pause();motion.hidden=true;liveLayer.hidden=true;svg.style.visibility='hidden';
 const product=root.querySelector('.muton-product');product.classList.add('detail-mode');product.style.aspectRatio='16 / 9';root.querySelector('.viz-controls').hidden=true;
 root.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed','false'));detailTab.setAttribute('aria-pressed','true');projectEntries();
 const info=detailInfo(kind,index),next=detailInfo(kind,index%info.count+1);
 root.querySelector('#md-title').textContent=info.title;root.querySelector('#md-category').textContent=info.category;root.querySelector('#md-next-title').textContent=next.title;
 const backLabel=kind==='work'?'← 返回精选作品':kind==='live'?'← 返回精选直播':'← 返回项目';detailPage.querySelectorAll('[data-detail-back]').forEach(button=>button.textContent=backLabel);
 const grid=root.querySelector('#md-media-grid'),portrait=kind==='live';grid.classList.toggle('is-portrait',portrait);

 detailPage.dataset.projectUid=info.uid;
 detailPage.querySelector('.md-cover').classList.toggle('is-live',portrait);
 const metadata=[info.service||info.category,info.role,info.year];
 detailPage.querySelectorAll('.md-summary dl>div').forEach((row,i)=>{row.hidden=!metadata[i];row.querySelector('dd').textContent=metadata[i]||'';});
 detailPage.querySelector('.md-summary p').textContent=info.summary;
 detailPage.querySelector('.md-hero-meta>span:last-child').textContent=info.year||info.service||'';
 const edited=kind==='live'?content.liveEditorial?.[info.uid]:content.editorial?.[info.uid];
 detailPage.querySelector('.md-summary p').hidden=!!edited;
 const explanation=detailPage.querySelector('.md-explanation');explanation.hidden=!!edited||!info.design;explanation.querySelector('p').textContent=info.design;
 grid.innerHTML=detailSections(info,kind);
 observeVideos();
 detailPage.querySelector('.md-wide').hidden=true;
 detailPage.querySelector('.md-endnote>span').textContent='MUTON.DES / '+info.category;
 detailScroll.scrollTop=0;
 revealDetail(info,kind,index,delay);
 root.querySelector('#muton-specs').innerHTML=[['封面首屏','统一加载 → 黑底与偏右封面揭开 → 左下标题与简介错峰入场；向下滚动再看具体作品'],['封面动态','沿用入口的同一案例封面；画面与边缘持续轻微波浪形变，文字独立保持稳定；减少动态模式显示静态封面'],['作品区域','逐项目分段：主视觉、效果图组合、组件板与限宽长图；完整保留图片比例'],['案例入口','项目索引中的 67 个案例、首页 12 个精选作品与 5 个精选直播接入同一模板'],['内容状态','已接入真实素材；首页精选、项目索引与详情共享项目记录。未核实字段不公开展示'],['浏览结束','回到顶部、返回来源页面、查看同组下一个案例']].map(row=>`<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td></tr>`).join('');
 root.querySelector('#muton-copy').textContent=detailScroll.textContent;root.querySelector('#muton-state').textContent='案例三级页 · '+info.title+' · 在画面内向下滚动查看完整模板';
}
function openDetail(kind,index){navigate('/case/'+kind+'/'+index);}

function detailBack(){if(history.state?.caseDepth)history.go(-history.state.caseDepth);else if(history.state?.source)history.back();else navigate(detailKind==='project'?'/projects':'/home/'+(detailKind==='work'?'works':'live'));}

detailTab.addEventListener('click',()=>openDetail('project',1));
detailPage.querySelectorAll('[data-detail-back]').forEach(button=>button.addEventListener('click',detailBack));
detailPage.querySelector('[data-detail-top]').addEventListener('click',()=>detailScroll.scrollTo({top:0,behavior:reducedLiveMotion.matches?'instant':'smooth'}));
root.querySelector('#md-next-project').addEventListener('click',()=>{const info=detailInfo(detailKind,detailIndex);openDetail(detailKind,detailIndex%info.count+1);});
detailScroll.addEventListener('scroll',()=>{clearTimeout(detailSaveTimer);detailSaveTimer=setTimeout(()=>{if(detailMode)save();},240);},{passive:true});
root.addEventListener('click',event=>{const work=event.target.closest('[data-detail-work]');if(work)openDetail('work',Number(work.dataset.detailWork));});
root.addEventListener('keydown',event=>{const work=event.target.closest('[data-detail-work]');if(work&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openDetail('work',Number(work.dataset.detailWork));}});

function restore(state){const v=state?.privateContent;if(v?.detailRevision!==2){select(0);return;}if(v&&Number.isInteger(v.chapter)&&v.chapter>=0&&v.chapter<8){p=v.chapter===6&&v.capabilityRevision!==2?.24:clamp(Number(v.p)||0);phone=Number.isInteger(v.phone)?clamp(v.phone,0,4):2;select(v.chapter,true);if(v.detailMode){const kind=['project','work','live'].includes(v.detailKind)?v.detailKind:'project';const limit=kind==='live'?5:kind==='work'?12:67;const index=Math.min(limit,Math.max(1,Number(v.detailIndex)||1));detailSourceProgress=Number(v.detailSourceProgress)||0;detailSourceScroll=Number(v.detailSourceScroll)||0;showDetail(kind,index);detailScroll.scrollTop=Number(v.detailScrollTop)||0;}else if(v.projectMode){projectCategory=projectCategories.some(c=>c[0]===v.projectCategory)?v.projectCategory:'全部';projectQuery=typeof v.projectQuery==='string'?v.projectQuery:'';projectSelected=Number.isInteger(v.projectSelected)?v.projectSelected:1;showProjectPage();}else if(v.livePageMode){showLivePage();liveScroll.scrollTop=v.liveRevision===8?Number(v.liveScrollTop)||0:0;}if(v.menuOpen)openMenu();}else{select(0);showDetail('project',1);}}

const assemblyScreen=root.querySelector('.ml-assembly-phone .ml-device-screen');
assemblyScreen.innerHTML=content.assembly.map((asset,i)=>`<img class="stage-screen-media assembly-slide ${i===0?'is-current':''}" data-media-src="${asset.preview||asset.src}" alt="${esc(asset.label)}">`).join('');
let assemblySlide=0;
setInterval(()=>{if(!livePageMode||document.hidden||reducedLiveMotion.matches||!liveAssembly.classList.contains('is-visible'))return;const slides=assemblyScreen.children;slides[assemblySlide].classList.remove('is-current');assemblySlide=(assemblySlide+1)%slides.length;slides[assemblySlide].classList.add('is-current');},4000);
const observeVideos=()=>observeMedia();
root.addEventListener('error',event=>{
 const img=event.target;if(!(img instanceof HTMLImageElement)||img.dataset.retried||!img.getAttribute('src'))return;
 img.dataset.retried='true';const source=img.getAttribute('src');
 setTimeout(()=>{if(img.isConnected)img.src=source+(source.includes('?')?'&':'?')+'retry=1';},300);
},true);
observeVideos();
document.addEventListener('visibilitychange',()=>root.querySelectorAll('video:not(#muton-hero-motion)').forEach(video=>{if(document.hidden)video.pause();else playVisibleMedia(video);}));

/* Hold the cover while the next surface rises above it. */
const detailHero=root.querySelector('.md-hero');
const syncCoverScroll=()=>detailHero.style.setProperty('--cover-scroll',Math.min(detailScroll.scrollTop,detailHero.offsetHeight)+'px');
detailScroll.addEventListener('scroll',syncCoverScroll,{passive:true});

/* Short-lived liquid lobes merge and detach; the approved four-petal texture stays crisp. */
const fluidProduct=root.querySelector('.muton-product');
const fluidCanvas=document.createElement('canvas');
fluidCanvas.id='muton-fluid-grid';fluidCanvas.setAttribute('aria-hidden','true');
fluidProduct.append(fluidCanvas);
const fluidCtx=fluidCanvas.getContext('2d');
const fluidField=document.createElement('canvas'),fieldCtx=fluidField.getContext('2d');
const fw=144,fh=90,size=fw*fh;
fluidField.width=fw;fluidField.height=fh;
const density=new Float32Array(size),pixels=fieldCtx.createImageData(fw,fh);
let fluidRaf=0,fluidLast=0,fluidPointer=null,fluidScale=1,fluidPattern;
let fluidHead=null,fluidDrops=[],fluidRelease=0,fluidDistance=0;
const fluidMode=()=>menuOpen||projectMode&&!detailMode?'off':detailMode?'gray':!livePageMode&&chapter===0?'hero-blue':'blue';
let lastFluidMode=fluidMode();
function clearFluid(){
 cancelAnimationFrame(fluidRaf);fluidRaf=0;fluidLast=0;fluidPointer=null;
 fluidHead=null;fluidDrops=[];fluidRelease=0;fluidDistance=0;density.fill(0);
 fluidCtx.clearRect(0,0,fluidCanvas.width,fluidCanvas.height);
}
function syncFluidMode(){const mode=fluidMode();if(mode!==lastFluidMode){clearFluid();lastFluidMode=mode;}fluidCanvas.dataset.mode=mode;return mode;}
const fluidSurfaceObserver=new MutationObserver(syncFluidMode);
for(const surface of [menu,detailPage,root.querySelector('#muton-project-page')])fluidSurfaceObserver.observe(surface,{attributes:true,attributeFilter:['hidden']});
const finePointer=matchMedia('(pointer:fine)');
function sizeFluid(){
 const r={width:innerWidth,height:innerHeight};fluidScale=Math.min(devicePixelRatio||1,1.5);
 fluidCanvas.width=Math.round(r.width*fluidScale);fluidCanvas.height=Math.round(r.height*fluidScale);
 const tile=document.createElement('canvas');tile.width=tile.height=Math.round(6*fluidScale);
 const ctx=tile.getContext('2d');ctx.scale(tile.width/16,tile.height/16);ctx.fillStyle='#fff';
 // Four rounded, diagonal petals; negative gaps remain visible at screen scale.
 ctx.beginPath();ctx.moveTo(8,5);ctx.bezierCurveTo(2,-1,-1,2,5,8);
 ctx.bezierCurveTo(-1,14,2,17,8,11);ctx.bezierCurveTo(14,17,17,14,11,8);
 ctx.bezierCurveTo(17,2,14,-1,8,5);ctx.closePath();ctx.fill();
 fluidPattern=fluidCtx.createPattern(tile,'repeat');
}
window.addEventListener('resize',sizeFluid);sizeFluid();
function addFluidDrop(drop,radius,weight,stretch,time){
 const angle=Math.atan2(drop.vy,drop.vx),cs=Math.cos(angle),sn=Math.sin(angle);
 // Convert the field's unequal cell dimensions to a circular screen-space halo.
 const aspect=fluidCanvas.height/fh/(fluidCanvas.width/fw),ry=radius/aspect;
 for(let y=Math.max(0,Math.floor(drop.y-ry*1.6));y<Math.min(fh,drop.y+ry*1.6);y++)for(let x=Math.max(0,Math.floor(drop.x-radius*1.6));x<Math.min(fw,drop.x+radius*1.6);x++){
  const dx=x-drop.x,dy=(y-drop.y)*aspect,u=(dx*cs+dy*sn)/(radius*stretch),v=(-dx*sn+dy*cs)/(radius/stretch);
  const edge=1+.075*Math.sin(Math.atan2(v,u)*3+time*2.1)+.04*Math.sin(time*3.2+v*4);
  density[y*fw+x]+=Math.exp(-(u*u+v*v)*2.8/(edge*edge))*weight;
 }
}
// Measure the transformed plane, including parent perspective, without its axis-aligned bounds.
const fluidPlanes=new WeakMap();
function clearFluidPlane(node,box){
 let markers=fluidPlanes.get(node);
 if(!markers){
  markers=[[0,0],[100,0],[100,100],[0,100]].map(([x,y])=>{const point=document.createElement('i');point.setAttribute('aria-hidden','true');point.style.cssText=`position:absolute;left:${x}%;top:${y}%;width:0;height:0;pointer-events:none`;node.append(point);return point;});
  fluidPlanes.set(node,markers);
 }
 const q=markers.map(point=>{const r=point.getBoundingClientRect();return{x:(r.left-box.left)*fluidScale,y:(r.top-box.top)*fluidScale};});
 const [a,b,c,d]=q,dx1=b.x-c.x,dx2=d.x-c.x,dy1=b.y-c.y,dy2=d.y-c.y;
 const dx3=a.x-b.x+c.x-d.x,dy3=a.y-b.y+c.y-d.y,det=dx1*dy2-dx2*dy1;
 if(Math.abs(det)<.001)return;
 const g=(dx3*dy2-dx2*dy3)/det,h=(dx1*dy3-dx3*dy1)/det;
 const project=(x,y)=>[( (b.x-a.x+g*b.x)*x+(d.x-a.x+h*d.x)*y+a.x)/(g*x+h*y+1),((b.y-a.y+g*b.y)*x+(d.y-a.y+h*d.y)*y+a.y)/(g*x+h*y+1)];
 const w=node.clientWidth,ht=node.clientHeight,radius=Math.min(parseFloat(getComputedStyle(node).borderTopLeftRadius),w/2,ht/2),rx=radius/w,ry=radius/ht;
 fluidCtx.save();fluidCtx.globalCompositeOperation='destination-out';fluidCtx.fillStyle='#000';fluidCtx.beginPath();
 [[1-rx,ry,-Math.PI/2],[1-rx,1-ry,0],[rx,1-ry,Math.PI/2],[rx,ry,Math.PI]].forEach(([cx,cy,start],corner)=>{
  for(let step=0;step<=8;step++){const t=start+step*Math.PI/16,[x,y]=project(cx+Math.cos(t)*rx,cy+Math.sin(t)*ry);if(!corner&&!step)fluidCtx.moveTo(x,y);else fluidCtx.lineTo(x,y);}
 });
 fluidCtx.closePath();fluidCtx.fill();fluidCtx.restore();
}
function tickFluid(time){
 fluidRaf=0;
 const mode=syncFluidMode();
 if(mode==='off'||document.hidden||reducedLiveMotion.matches||!finePointer.matches){clearFluid();return;}
 const dt=Math.min(.05,(time-(fluidLast||time-16.7))/1000);fluidLast=time;density.fill(0);
 let energy=0;
 if(fluidHead){
  const target=fluidPointer||fluidHead,k=1-Math.exp(-dt/ .035);
  fluidHead.x+=(target.x-fluidHead.x)*k;fluidHead.y+=(target.y-fluidHead.y)*k;
  const lag=Math.hypot(target.x-fluidHead.x,target.y-fluidHead.y);
  if(lag>7){fluidHead.x=target.x+(fluidHead.x-target.x)*7/lag;fluidHead.y=target.y+(fluidHead.y-target.y)*7/lag;}
  const age=Math.min(1,Math.max(0,(time-fluidHead.moved-130)/1200)),fade=1-age*age*(3-2*age),speed=Math.hypot(fluidHead.vx,fluidHead.vy);
  addFluidDrop(fluidHead,20+Math.min(3,speed*.018),fade,1+Math.min(.3,speed*.002),time/1000);
  fluidHead.vx*=Math.exp(-dt*8);fluidHead.vy*=Math.exp(-dt*8);
 }
 fluidDrops=fluidDrops.filter(drop=>time-drop.born<980);
 for(const drop of fluidDrops){
  const age=Math.max(0,(time-drop.born-80)/900);
  drop.x+=drop.vx*dt;drop.y+=drop.vy*dt;drop.vx*=Math.exp(-dt*7);drop.vy*=Math.exp(-dt*7);
  addFluidDrop(drop,drop.radius*(1-.12*age),.78*Math.pow(1-age,1.1),1+.26*(1-age),time/1000+drop.born);
 }
 const color=mode==='gray'?[180,184,192]:mode==='hero-blue'?[20,20,215]:[4,0,255],strength=mode==='gray'?95:mode==='hero-blue'?175:245;
 for(let k=0;k<size;k++){const j=k*4,a=Math.min(1,Math.max(0,(density[k]-.018)/.85));pixels.data[j]=color[0];pixels.data[j+1]=color[1];pixels.data[j+2]=color[2];pixels.data[j+3]=a*a*(3-2*a)*strength;energy+=pixels.data[j+3];}
 fieldCtx.putImageData(pixels,0,0);
 const w=fluidCanvas.width,h=fluidCanvas.height;
 fluidCtx.globalCompositeOperation='source-over';fluidCtx.clearRect(0,0,w,h);fluidCtx.imageSmoothingEnabled=true;
 fluidCtx.drawImage(fluidField,0,0,w,h);fluidCtx.globalCompositeOperation='destination-in';fluidCtx.fillStyle=fluidPattern;fluidCtx.fillRect(0,0,w,h);fluidCtx.globalCompositeOperation='source-over';
 const box={left:0,top:0,width:innerWidth,height:innerHeight};
 const surface=menuOpen?menu:detailMode?detailPage:projectMode?root.querySelector('#muton-project-page'):livePageMode?root.querySelector('#muton-live-page'):fluidProduct;
 const contentTop=detailMode?detailPage.querySelector('.md-content').getBoundingClientRect().top:Infinity;
 surface.querySelectorAll('img,video,canvas:not(#muton-fluid-grid),image,[data-logo],.muton-phone,.ml-assembly-phone,.ml-case-face').forEach(node=>{
  if(node===motion||node.id==='muton-portrait-wave'||node.matches('[data-about-portrait]')&&root.classList.contains('portrait-wave-ready')||node.closest('.ml-assembly-phone,.ml-case-face')&&!node.matches('.ml-assembly-phone,.ml-case-face')||node.closest('[data-brand-logo]')||node.matches('image')&&node.closest('[data-logo]')||node.closest('.muton-phone')&&!node.matches('.muton-phone'))return; // The hero movie is a background, so the grid remains visible above it.
  if(node.closest('[hidden]'))return;
  const r=node.getBoundingClientRect();let bottom=r.bottom;
  if(detailMode&&node===detailCanvas)bottom=Math.min(bottom,contentTop);
  if(r.width&&r.height&&bottom>box.top&&r.top<box.bottom){
   if(node.matches('.ml-assembly-phone,.ml-case-face')){
    clearFluidPlane(node,box);
   }else if(node.matches('[data-logo]')){
    fluidCtx.save();fluidCtx.globalCompositeOperation='destination-out';fluidCtx.fillStyle='#000';fluidCtx.beginPath();
    fluidCtx.ellipse((r.left+r.width/2-box.left)*fluidScale,(r.top+r.height/2-box.top)*fluidScale,r.width/2*fluidScale,r.height/2*fluidScale,0,0,Math.PI*2);fluidCtx.fill();fluidCtx.restore();
   }else if(node.matches('.muton-phone')){
    const radius=parseFloat(getComputedStyle(node).borderTopLeftRadius)*r.width/node.offsetWidth;
    fluidCtx.save();fluidCtx.globalCompositeOperation='destination-out';fluidCtx.fillStyle='#000';fluidCtx.beginPath();
    fluidCtx.roundRect((r.left-box.left)*fluidScale,(r.top-box.top)*fluidScale,r.width*fluidScale,r.height*fluidScale,radius*fluidScale);fluidCtx.fill();fluidCtx.restore();
   }else if(node.matches('[data-about-portrait]')){
    const m=node.getScreenCTM();fluidCtx.save();fluidCtx.globalCompositeOperation='destination-out';fluidCtx.fillStyle='#000';
    fluidCtx.setTransform(m.a*fluidScale,m.b*fluidScale,m.c*fluidScale,m.d*fluidScale,(m.e-box.left)*fluidScale,(m.f-box.top)*fluidScale);
    fluidCtx.fillRect(node.x.baseVal.value,node.y.baseVal.value,node.width.baseVal.value,node.height.baseVal.value);fluidCtx.restore();
   }else fluidCtx.clearRect((r.left-box.left)*fluidScale,(r.top-box.top)*fluidScale,r.width*fluidScale,Math.max(0,bottom-r.top)*fluidScale);
  }
 });
 const portrait=root.querySelector('#muton-portrait-wave');
 if(portrait&&!portrait.hidden&&portrait.width&&portrait.height){const r=portrait.getBoundingClientRect();fluidCtx.save();fluidCtx.globalCompositeOperation='destination-out';fluidCtx.drawImage(portrait,(r.left-box.left)*fluidScale,(r.top-box.top)*fluidScale,r.width*fluidScale,r.height*fluidScale);fluidCtx.restore();}
 // Keep the fluid effect continuous behind the transparent navigation.
 if(energy>1)fluidRaf=requestAnimationFrame(tickFluid);else{fluidCtx.clearRect(0,0,w,h);fluidLast=0;}
}
fluidProduct.addEventListener('pointermove',event=>{
 if(syncFluidMode()==='off'||event.pointerType==='touch'||reducedLiveMotion.matches||!finePointer.matches)return;
 const r={left:0,top:0,width:innerWidth,height:innerHeight},x=(event.clientX-r.left)/r.width*fw,y=(event.clientY-r.top)/r.height*fh;
 const now=performance.now(),dx=fluidPointer?x-fluidPointer.x:0,dy=fluidPointer?y-fluidPointer.y:0;
 const seconds=fluidPointer?Math.max(.008,(now-fluidPointer.time)/1000):.016;
 const speed=Math.hypot(dx,dy)/seconds,cap=speed>180?180/speed:1,vx=dx/seconds*cap,vy=dy/seconds*cap;
 if(!fluidHead)fluidHead={x,y,vx,vy,moved:now};
 fluidDistance+=Math.hypot(dx,dy);
 if(fluidDistance>17&&now-fluidRelease>110){
  fluidDrops.push({x:fluidHead.x,y:fluidHead.y,vx:fluidHead.vx*.13,vy:fluidHead.vy*.13,radius:12+(fluidDrops.length%2)*2,born:now});
  if(fluidDrops.length>10)fluidDrops.shift();fluidRelease=now;fluidDistance=0;
 }
 fluidHead.vx=vx;fluidHead.vy=vy;fluidHead.moved=now;
 fluidPointer={x,y,time:now};if(!fluidRaf)fluidRaf=requestAnimationFrame(tickFluid);
},{passive:true});
fluidProduct.addEventListener('pointerleave',()=>{fluidPointer=null;},{passive:true});
reducedLiveMotion.addEventListener('change',()=>{if(reducedLiveMotion.matches)clearFluid();});

/* Same low-frequency mesh motion as the case cover, softened around the face. */
const portraitCanvas=document.createElement('canvas');
portraitCanvas.id='muton-portrait-wave';portraitCanvas.hidden=true;portraitCanvas.setAttribute('aria-hidden','true');
fluidProduct.append(portraitCanvas);
const portraitGL=portraitCanvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
if(portraitGL){
 const gl=portraitGL,program=gl.createProgram();
 const shaders=[[gl.VERTEX_SHADER,`attribute vec2 a;uniform float t;uniform float motion;varying vec2 uv;
 void main(){uv=a;vec2 p=a*2.-1.;vec2 face=(a-vec2(.48,.66))/vec2(.25,.22);float soft=1.-.86*exp(-dot(face,face)*1.6);
 p.x+=motion*soft*(sin(a.y*4.5+t*.72+a.x*2.2)*.024+sin(t*.43)*.006);
 p.y+=motion*soft*(sin(a.x*5.4-t*.58+a.y*1.8)*.030+sin(a.y*3.2+t*.6)*.006);
 gl_Position=vec4(p*.94,0.,1.);}`],[gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 uv;uniform sampler2D photo;uniform vec2 crop;void main(){gl_FragColor=texture2D(photo,(vec2(uv.x,1.-uv.y)-.5)*crop+.5);}`]];
 for(const[type,source]of shaders){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);gl.attachShader(program,shader);}
 gl.linkProgram(program);gl.useProgram(program);
 const vertices=[];for(let y=0;y<32;y++)for(let x=0;x<32;x++){const a=x/32,b=y/32,c=(x+1)/32,d=(y+1)/32;vertices.push(a,b,c,b,a,d,a,d,c,b,c,d);}
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
 const at=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
 gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
 for(const name of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,name,gl.LINEAR);
 for(const name of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,name,gl.CLAMP_TO_EDGE);
 const time=gl.getUniformLocation(program,'t'),motion=gl.getUniformLocation(program,'motion');
 let portraitReady=false,portraitRaf=0;
 function drawPortrait(t){
  portraitRaf=0;const source=root.querySelector('#about [data-about-portrait]');
  portraitCanvas.hidden=!portraitReady||!source||menuOpen||projectMode||livePageMode||detailMode||document.hidden;
  if(portraitCanvas.hidden)return;
  if(sections[3].last<.999&&sections[3].scene.getBoundingClientRect().bottom>0){portraitCanvas.hidden=true;return;}
  if(source.getBoundingClientRect().width===0||source.getBoundingClientRect().bottom<0||source.getBoundingClientRect().top>innerHeight){portraitCanvas.hidden=true;return;}
  const r=source.getBoundingClientRect(),box={left:0,top:0},w=r.width/.94,h=r.height/.94,dpr=Math.min(devicePixelRatio||1,2);
  portraitCanvas.style.cssText=`left:${r.left-box.left-(w-r.width)/2}px;top:${r.top-box.top-(h-r.height)/2}px;width:${w}px;height:${h}px`;
  if(portraitCanvas.width!==Math.round(w*dpr)||portraitCanvas.height!==Math.round(h*dpr)){portraitCanvas.width=Math.round(w*dpr);portraitCanvas.height=Math.round(h*dpr);}
  gl.viewport(0,0,portraitCanvas.width,portraitCanvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(time,t/1000);gl.uniform1f(motion,reducedLiveMotion.matches?0:1);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
  if(!reducedLiveMotion.matches)portraitRaf=requestAnimationFrame(drawPortrait);
 }
 const queuePortrait=()=>{const source=root.querySelector('#about [data-about-portrait]');if(!photo.src&&source&&source.getBoundingClientRect().top<innerHeight+400)photo.src=content.portrait.src;if(!portraitRaf)portraitRaf=requestAnimationFrame(drawPortrait);};
 const photo=new Image();photo.onload=()=>{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,photo);const ratio=photo.naturalWidth/photo.naturalHeight,target=690/730;gl.uniform2f(gl.getUniformLocation(program,'crop'),Math.min(1,target/ratio),Math.min(1,ratio/target));portraitReady=true;root.classList.add('portrait-wave-ready');queuePortrait();};
 new MutationObserver(queuePortrait).observe(root,{childList:true,subtree:true});
 const modeObserver=new MutationObserver(queuePortrait);modeObserver.observe(fluidProduct,{attributes:true,attributeFilter:['class']});modeObserver.observe(menu,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',queuePortrait);
 window.addEventListener('scroll',queuePortrait,{passive:true});
 document.addEventListener('visibilitychange',queuePortrait);reducedLiveMotion.addEventListener('change',queuePortrait);
}

/* One open line arrow; rotation preserves the original direction at every entry. */
const arrowAngles={'↗':0,'→':45,'↘':90,'↓':135,'↙':180,'←':225,'↖':270,'↑':315};
const arrowPath='M3 21L21 3M7 3H21V17',arrowNS='http://www.w3.org/2000/svg';
const arrowMarkup=direction=>`<svg class="muton-line-arrow" data-arrow-direction="${direction}" viewBox="0 0 24 24" aria-hidden="true"><path d="${arrowPath}" transform="rotate(${arrowAngles[direction]} 12 12)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;
let arrowRaf=0;
const arrowObserver=new MutationObserver(()=>{if(!arrowRaf)arrowRaf=requestAnimationFrame(refreshArrows);});
function refreshArrows(){
 arrowRaf=0;arrowObserver.disconnect();
 if(copyChanges.length){
  const copyWalker=document.createTreeWalker(fluidProduct,NodeFilter.SHOW_TEXT);
  while(copyWalker.nextNode()){
   const node=copyWalker.currentNode;if(node.parentElement.closest('script,style,svg'))continue;
   const old=copyNodes.get(node),source=old&&old.result===node.data?old.source:node.data;
   let result=source;for(const [from,to]of copyChanges)result=result.split(from).join(to);
   if(node.data!==result)node.data=result;copyNodes.set(node,{source,result});
  }
 }

 const walker=document.createTreeWalker(fluidProduct,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode()){const n=walker.currentNode;if(/[↗→↘↓↙←↖↑]/.test(n.textContent)&&!n.parentElement.closest('[data-arrow-source],.muton-line-arrow,script,style'))nodes.push(n);}
 for(const node of nodes){
  const svgText=node.parentElement.closest('text');
  if(svgText){
   if(svgText.dataset.arrowSource||!svgText.getBoundingClientRect().width)continue;
   const value=svgText.textContent,size=parseFloat(getComputedStyle(svgText).fontSize),fill=getComputedStyle(svgText).fill,arrows=[];
   [...value].forEach((char,i)=>{if(char in arrowAngles){const extent=svgText.getExtentOfChar(i),start=svgText.getStartPositionOfChar(i);arrows.push({char,x:extent.x+(extent.width-size)/2,y:start.y-size*.84});}});
   svgText.dataset.arrowSource='true';svgText.replaceChildren();
   for(const part of value.split(/([↗→↘↓↙←↖↑])/)){if(part in arrowAngles){const span=document.createElementNS(arrowNS,'tspan');span.textContent=part;span.setAttribute('fill','transparent');svgText.append(span);}else svgText.append(document.createTextNode(part));}
   for(const arrow of arrows){const g=document.createElementNS(arrowNS,'g');g.dataset.arrowDirection=arrow.char;g.setAttribute('aria-hidden','true');g.style.pointerEvents='none';g.setAttribute('transform',`${svgText.getAttribute('transform')||''} translate(${arrow.x} ${arrow.y}) scale(${size/24})`);g.innerHTML=`<path d="${arrowPath}" transform="rotate(${arrowAngles[arrow.char]} 12 12)" fill="none" stroke="${fill}" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"/>`;svgText.after(g);}
  }else{
   const fragment=document.createDocumentFragment();for(const part of node.textContent.split(/([↗→↘↓↙←↖↑])/)){if(part in arrowAngles){const holder=document.createElement('span');holder.innerHTML=arrowMarkup(part);fragment.append(holder.firstChild);}else fragment.append(document.createTextNode(part));}node.replaceWith(fragment);
  }
 }
 arrowObserver.observe(fluidProduct,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
}
refreshArrows();


/* Phase three: native document sections, addressable routes and reading position. */
const sectionTitleTimes=Array(8).fill(-10000);
const sectionIds=['top','services','works','live','about','experience','capabilities','contact'];
const product=root.querySelector('.muton-product');
const mobile=matchMedia('(max-width:700px)');
let siteReady=false,routeApplying=false,scrollFrame=0,loadingFrame=0;
let currentRoute='/home/top',homePosition=0;
const home=document.createElement('main');home.id='home-flow';home.setAttribute('aria-label','陈其林的作品与经历');
product.prepend(home);
const originalSVG=svg;
const sections=sectionIds.map((id,i)=>{
 const section=document.createElement('section');section.className='home-section';section.id=id;section.setAttribute('aria-label',names[i]);
 const scene=document.createElement('div');scene.className='home-scene';
 const art=i===0?originalSVG:document.createElementNS('http://www.w3.org/2000/svg','svg');
 art.classList.add('home-stage');art.setAttribute('viewBox','0 0 1920 1080');art.setAttribute('aria-label',names[i]);
 scene.append(art);section.append(scene);home.append(section);
 return {section,scene,art,last:-1};
});
sections[0].scene.prepend(motion);sections[3].scene.append(liveLayer);
const navBar=document.createElement('nav');navBar.className='site-nav';navBar.setAttribute('aria-label','全站导航');product.append(navBar);
for(const id of ['home','contact','project','live','menu'])navBar.append(root.querySelector('#muton-'+id+'-entry'));
root.querySelector('#muton-home-entry').innerHTML=`<svg viewBox="0 0 240 60" aria-hidden="true">${brandLogo(0,17,220)}</svg>`;
root.querySelector('#muton-contact-entry').innerHTML='聊聊合作 <span aria-hidden="true">↘</span>';
for(const [id,label]of [['project','项目'],['live','直播'],['menu','菜单']])root.querySelector('#muton-'+id+'-entry').textContent=label;
const allWork=root.querySelector('#muton-all-projects'),allLive=root.querySelector('#muton-all-live');
product.append(allWork,allLive);
allWork.textContent='SEE ALL PROJECTS →';allLive.textContent='SEE ALL LIVE SCENES →';
const progress=document.createElement('div');progress.id='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
const horizontalProgress=document.createElement('div');horizontalProgress.id='reading-progress-bottom';horizontalProgress.setAttribute('aria-hidden','true');horizontalProgress.innerHTML='<span></span>';document.body.append(horizontalProgress);
let progressIdle=0;
function wakeProgress(){progress.classList.add('is-scrolling');clearTimeout(progressIdle);progressIdle=setTimeout(()=>progress.classList.remove('is-scrolling'),1100);}
const notice=document.createElement('div');notice.className='site-notice';notice.setAttribute('role','status');product.append(notice);
const skip=document.createElement('a');skip.className='skip-link';skip.href='#/home/works';skip.textContent='跳到精选作品';document.body.prepend(skip);

// Mobile reflows the same confirmed content; desktop keeps the original compositions.
const mobileBody=(i)=>{
 if(i===0)return `<div class="mobile-hero-copy"><h1>从品牌识别<br>到商业现场。</h1><p>陈其林<br>品牌视觉 Design Lead</p><p>用系统建立识别，用创意连接业务。<br>从关键视觉主创，到团队与项目统筹。</p><a href="#/home/works">探索我的作品 ↘</a></div>`;
 if(i===1)return `<p class="section-kicker">{ REAL SERVICE }</p><h2>Let design take place within<br>real-world business operations.</h2><h2>让设计发生在<br>真实业务里面</h2><div class="mobile-logos">${content.logos.map((a,i)=>`<svg viewBox="${i%8*192} ${Math.floor(i/8)*192} 192 192" role="img" aria-label="${esc(a.label)}"><image data-media-src="${a.src}" width="1536" height="768"/></svg>`).join('')}</div>`;
 if(i===2)return `<h2 class="section-kicker">{ 我的精选作品 }</h2><div class="mobile-works">${content.featured.map((id,i)=>{const a=projects[id-1];return `<a class="mobile-work" href="#/case/work/${i+1}">${mediaMarkup(a.cover,'data-preview')}<span>${esc(a.tag||a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><i aria-hidden="true">↗</i></a>`;}).join('')}</div><a class="outline-link" href="#/projects">SEE ALL PROJECTS →</a>`;
 if(i===3)return `<h2 class="section-kicker">{ 全场景直播视觉方案 }</h2><div class="mobile-phones">${content.live.map((a,i)=>`<a href="#/case/live/${i+1}"><div class="mobile-device">${mediaMarkup(a.cover,'class="stage-screen-media"')}</div><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p></a>`).join('')}</div><a class="outline-link" href="#/live">SEE ALL LIVE SCENES →</a><div class="mobile-behind">BEHIND<br>THE WORK</div>`;
 if(i===4)return `<p class="section-kicker">{ ABOUT ME }</p><img class="mobile-portrait" data-media-src="${content.portrait.src}" alt="陈其林个人照片"><h2>亲自设计<br>也让好的设计<br>持续发生。</h2><p>在品牌策划公司、广告集团与消费品牌甲方积累经验，将品牌识别、内容传播和商业场景连接起来。</p><p>亲自做好关键设计，也让团队的交付持续向前。</p><div class="mobile-stats"><p>2020—2026<small>品牌与商业视觉实践</small></p><p>杭州<small>品牌视觉 · 设计统筹</small></p></div>`;
 if(i===5)return `<h2>工作路径</h2><p class="section-kicker">EXPERIENCE / 2020–2026</p>${content.jobs.map((job,i)=>`<details><summary><small>${esc(job.years)}</small><span>${esc(job.company)}</span><small>${esc(jobs[i][2])}</small></summary>${job.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</details>`).join('')}`;
 if(i===6)return `<h2>π 型能力<br>有深度，也有连接。</h2><div class="mobile-pi" aria-hidden="true">π</div>${caps.map((c,i)=>`<div class="mobile-capability"><p>0${i+1} / ${esc(c[0])}</p><h3>${c[2].map(esc).join('<br>')}</h3><a class="green" href="#${['/case/project/1','/case/project/23','/home/experience'][i]}">${esc(c[3])}</a></div>`).join('')}`;
 return `<p class="section-kicker">{ NEXT CHAPTER }</p><a href="#/home/top" class="mobile-top">回到顶部 ↑</a><h2>下一个项目。</h2><a class="contact-start" href="mailto:muton2.45@gmail.com">一起 <span class="green">开始 ↘</span></a><p class="contact-description">期待品牌视觉与设计管理的工作机会，<br>也欢迎品牌全案、商业视觉与产品设计合作。</p><a class="contact-line" href="tel:17729854302"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${contactIcon('phone')}</svg>17729854302</a><a class="contact-line" href="mailto:muton2.45@gmail.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${contactIcon('email')}</svg>muton2.45@gmail.com</a><button data-copy-email>复制邮箱</button><p class="mobile-copyright">© 2026 陈其林<br>品牌视觉 / Design Lead</p><div class="contact-qrs"><figure><img data-media-src="assets/contact-wechat.png" alt="联系微信二维码"><figcaption>联系微信</figcaption></figure><figure><img data-media-src="assets/contact-zcool.png" alt="站酷首页二维码"><figcaption>站酷首页</figcaption></figure></div><div class="mobile-talk" aria-hidden="true">LET’S TALK</div>`;
};
sections.forEach(({section},i)=>{const body=document.createElement('div');body.className='mobile-content';body.innerHTML=mobileBody(i);section.append(body);});
// Keep desktop SVG calls to action operable without changing their artwork.
sections[0].scene.insertAdjacentHTML('beforeend','<a class="hero-work-hit" href="#/home/works" aria-label="探索我的作品"></a>');
sections[7].scene.insertAdjacentHTML('beforeend',`<a class="footer-hit footer-top" href="#/home/top" aria-label="回到顶部"></a><a class="footer-hit footer-email" href="mailto:muton2.45@gmail.com" aria-label="发送邮件"></a><a class="footer-hit footer-start" href="mailto:muton2.45@gmail.com" aria-label="聊聊下一个项目"></a><button class="footer-hit footer-copy" data-copy-email aria-label="复制邮箱"></button><a class="footer-hit footer-phone" href="tel:17729854302" aria-label="拨打电话 17729854302"></a>`);

function setBackgroundInert(value){
 for(const el of [home,projectPage,livePage,detailPage])el.inert=value;
}
function activeScroller(){return detailMode?detailScroll:livePageMode?liveScroll:projectMode?projectList:document.scrollingElement;}
function updateProgress(){
 const el=activeScroller(),max=el.scrollHeight-el.clientHeight;
 progress.hidden=horizontalProgress.hidden=max<=1||menuOpen||projectMode;
 const ratio=max>0?clamp(el.scrollTop/max):0;
 progress.style.transform=`translateY(${ratio*(innerHeight-progress.offsetHeight)}px)`;
 horizontalProgress.style.setProperty('--read',ratio); 
}
function persistRoute(){
 if(!siteReady||routeApplying)return;
 if(!projectMode&&!livePageMode&&!detailMode)homePosition=scrollY;
 history.replaceState({...history.state,route:currentRoute,focus:document.activeElement?.getAttribute('data-project-id')||history.state?.focus,scroll:activeScroller().scrollTop,home:homePosition,category:projectCategory,query:projectQuery,selected:projectSelected,expanded},'',location.href);
 updateProgress();
}
function navigate(path){
 if(routeApplying)return;
 if(path===currentRoute&& !path.startsWith('/home/')){closeMenu();return;}
 persistRoute();
 const source=currentRoute;
 const caseDepth=path.startsWith('/case/')?(currentRoute.startsWith('/case/')?(history.state?.caseDepth||0)+1:1):0;
 history.pushState({route:path,source,home:homePosition,caseDepth},'','#'+path);
 applyRoute(path,false);
}
function applyRoute(path,restorePosition=false){
 routeApplying=true;cancelAnimationFrame(loadingFrame);closeMenu(false);stop();
 const state=history.state||{},parts=path.split('/');
 if(parts[1]==='case'&&!(['project','work','live'].includes(parts[2])&&/^\d+$/.test(parts[3])&&Number(parts[3])>=1&&Number(parts[3])<=(parts[2]==='project'?67:parts[2]==='work'?12:5))){path='/projects';history.replaceState({...state,route:path},'','#'+path);}
 currentRoute=path;
 const isHome=path.startsWith('/home/');
 document.body.classList.toggle('subpage-open',!isHome);
 home.hidden=!isHome;
 if(isHome){
  leaveDetail();leaveProjects();leaveLivePage();svg.style.visibility='';
  const index=Math.max(0,sectionIds.indexOf(path.split('/')[2]));
  const target=restorePosition&&Number.isFinite(state.scroll)?state.scroll:Math.max(0,sections[index].section.offsetTop-navBar.offsetHeight);
  window.scrollTo({top:target,behavior:'instant'});homePosition=target;
  document.title='MUTON.DES · 陈其林 | 品牌视觉 / Design Lead';
  renderHome(true);
 }else{
  window.scrollTo({top:0,behavior:'instant'});
  const show=()=>{
   if(path==='/projects'){
    projectCategory=state.category||'全部';projectQuery=state.query||'';projectSelected=state.selected||1;showProjectPage();document.title='项目 · MUTON.DES';
   }else if(path==='/live'){showLivePage(reducedLiveMotion.matches||restorePosition?0:pageLoadDuration*1000);document.title='直播视觉 · MUTON.DES';}
   else if(path.startsWith('/case/')){showDetail(parts[2],Number(parts[3]),reducedLiveMotion.matches||restorePosition?0:pageLoadDuration*1000);document.title=detailInfo(parts[2],Number(parts[3])).title+' · MUTON.DES';}
   else{currentRoute='/projects';showProjectPage();}
  };
  if(restorePosition)show();else transitionToPage(show);
  activeScroller().scrollTop=restorePosition?(state.scroll||0):0;
  activeScroller().setAttribute('tabindex','0');activeScroller().focus({preventScroll:true});
 }
 routeApplying=false;projectEntries();updateProgress();wakeProgress();
 requestAnimationFrame(()=>{if(restorePosition&&Number.isFinite(state.scroll)){activeScroller().scrollTop=state.scroll;if(projectMode&&state.focus)projectList.querySelector(`[data-project-id="${state.focus}"]`)?.focus({preventScroll:true});}updateProgress();});
}
function chapterProgress(i,ratio){
 if(i===0)return 1;
 if(i===1)return .9*ratio;
 if(i===2)return .2+.8*ratio;
 if(i===3)return .719+.281*ratio;
 if(i===4)return .2;
 if(i===5)return .1;
 if(i===6)return .03+.97*ratio;
 return 1;
}
function renderSection(i,value){
 chapter=i;p=value;svg=sections[i].art;sections[i].last=value;
 if(i===2&&reducedLiveMotion.matches)workColumns.fill(clamp((p-.2)/.8));
 draw();
 if(i===5){const heights=[...svg.querySelectorAll('[data-job], [data-job-description]')].map(el=>{const b=el.getBBox();return b.y+b.height+100;});const height=Math.max(1080,...heights);svg.setAttribute('viewBox',`0 0 1920 ${height}`);sections[i].scene.style.height=`${height/1920*sections[i].scene.clientWidth}px`;}
 sections[i].last=value;
}
function sizeSections(){
 const h=Math.min(innerWidth*1080/1920,innerHeight-92),width=h*1920/1080;
 const extras=[0,h*.8,width*2280/1920,h,0,0,h*2.8,0];
 sections.forEach(({section,scene},i)=>{
  const hero=i===0,sceneH=hero?innerWidth*1080/1920:h;
  section.style.setProperty('--scene-height',sceneH+'px');
  section.style.setProperty('--scene-width',(hero?innerWidth:width)+'px');
  section.style.setProperty('--travel',mobile.matches?'0px':extras[i]+'px');
  section.style.setProperty('--pin-top',(hero?-Math.max(0,sceneH-innerHeight-6):46)+'px');
 });
 renderHome(true);updateProgress();
}
function syncSectionLinks(){
 const inHome=!home.hidden&&!menuOpen&&!mobile.matches;
 const visibleSection=[3,2].find(i=>{const box=sections[i].section.getBoundingClientRect();return box.top<innerHeight*.7&&box.bottom>innerHeight*.3;});
 [allWork,allLive].forEach((button,j)=>{
  const i=j+2,elapsed=performance.now()-sectionTitleTimes[i];
  const count=[...['{ 我的精选作品 }','{ 全场景直播视觉方案 }'][j]].length;
  button.hidden=!inHome||visibleSection!==i||(!reducedLiveMotion.matches&&elapsed<count*70)||(j===1&&sections[3].last>.735);
 });
}
function renderHome(force=false){
 if(home.hidden||menuOpen)return;
 if(mobile.matches){sections[7].section.style.background='';motion.hidden=false;motion.style.visibility='';if(!reducedLiveMotion.matches&&!document.hidden&&sections[0].section.getBoundingClientRect().bottom>0)motion.play().catch(()=>{});else motion.pause();return;}
 let active=0;
 sections.forEach(({section,scene},i)=>{
  const box=section.getBoundingClientRect(),travel=parseFloat(section.style.getPropertyValue('--travel'))||0;
  if(box.top<innerHeight*.55)active=i;
  if(!force&&(box.bottom<0||box.top>innerHeight))return;
  const pin=parseFloat(section.style.getPropertyValue('--pin-top'))||0;
  const lead=i===1?innerHeight*.15:0;
  const value=chapterProgress(i,travel?clamp((pin+lead-box.top)/(travel+lead)):0);
  if(force||Math.abs(value-sections[i].last)>.0002)renderSection(i,value);
 });
 [3,6].forEach(i=>{const complete=sections[i].last>=.999;sections[i].scene.style.visibility=complete&&sections[i+1].section.getBoundingClientRect().top<=46?'hidden':'';sections[i+1].scene.style.visibility=complete?'':'hidden';if(i===6)sections[7].section.style.background=complete?'#0000f0':'#000';});
 chapter=active;svg=sections[active].art;p=sections[active].last;
 motion.hidden=false;
 syncSectionLinks();
 const heroVisible=sections[0].section.getBoundingClientRect().bottom>0;
 if(heroVisible&&!document.hidden&&!reducedLiveMotion.matches)motion.play().catch(()=>{});else motion.pause();
 projectEntries();
 // These controls belong to their sections, not to a chapter selector.
 syncSectionLinks();
}
function onScroll(){
 wakeProgress();if(scrollFrame)return;
 scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;renderHome();updateProgress();persistRoute();});
}
window.addEventListener('scroll',onScroll,{passive:true});
for(const el of [projectList,liveScroll,detailScroll])el.addEventListener('scroll',()=>{wakeProgress();updateProgress();persistRoute();},{passive:true});
new ResizeObserver(updateProgress).observe(detailScroll);
root.addEventListener('load',updateProgress,true);
window.addEventListener('resize',sizeSections);
mobile.addEventListener('change',()=>{sections[5].scene.style.height='';sizeSections();});
window.addEventListener('popstate',()=>applyRoute(location.hash.slice(1)||'/home/top',true));
window.addEventListener('hashchange',()=>{const path=location.hash.slice(1)||'/home/top';if(path!==currentRoute)applyRoute(path);});
document.addEventListener('click',event=>{
 const anchor=event.target.closest('a[href^="#/"]');
 if(anchor&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();navigate(anchor.getAttribute('href').slice(1));}
 const copy=event.target.closest('[data-copy-email]');
 if(copy)navigator.clipboard.writeText('muton2.45@gmail.com').then(()=>{notice.textContent='邮箱已复制';setTimeout(()=>notice.textContent='',2200);}).catch(()=>{notice.textContent='邮箱：muton2.45@gmail.com';});
});
root.addEventListener('keydown',event=>{const job=event.target.closest('[data-job]');if(job&&(event.key==='Enter'||event.key===' ')){event.preventDefault();job.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
root.addEventListener('click',event=>{
 if(event.target.closest('[data-job]')){renderSection(5,.1);requestAnimationFrame(updateProgress);}
});
// Keep menu scroll locked and dialog focus contained, using the original Escape/Tab handling.
const originalEntries=projectEntries;
projectEntries=function(){originalEntries();if(siteReady){syncSectionLinks();navBar.hidden=!mobile.matches&&!projectMode&&!livePageMode&&!detailMode&&!menuOpen&&chapter===0&&p*6.5<1.45;navBar.querySelectorAll('button').forEach(b=>b.hidden=false);}};
history.scrollRestoration='manual';
siteReady=true;sizeSections();
const titleObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(!isIntersecting||reducedLiveMotion.matches)return;
 const i=Number(target.dataset.titleSection);sectionTitleTimes[i]=performance.now();
 const tick=()=>{const spans=sections[i].art.querySelectorAll('[data-chapter-title] tspan'),n=Math.floor((performance.now()-sectionTitleTimes[i])/70);spans.forEach((s,j)=>s.setAttribute('opacity',j<n?'1':'0'));syncSectionLinks();if(n<30)requestAnimationFrame(tick);};tick();
}),{threshold:.2});
[2,3].forEach(i=>{sections[i].scene.dataset.titleSection=i;titleObserver.observe(sections[i].scene);});
// A paused video still shows the approved wordmark in reduced-motion mode.
if(reducedLiveMotion.matches){const still=()=>{motion.currentTime=7;motion.pause();};if(motion.readyState>=1)still();else motion.addEventListener('loadedmetadata',still,{once:true});}

const initialRoute=location.hash.slice(1)||'/home/top';
if(!location.hash)history.replaceState({route:initialRoute},'','#'+initialRoute);
applyRoute(initialRoute,!!history.state?.scroll);
function replayHeroEntrance(){
 cancelAnimationFrame(loadingFrame);restartHeroTyping();
 if(reducedLiveMotion.matches||mobile.matches)return;
 const started=performance.now();
 const load=now=>{
  if(currentRoute!=='/home/top'||scrollY>50||mobile.matches)return;
  renderSection(0,clamp((now-started)/6500));
  if(now-started<6500)loadingFrame=requestAnimationFrame(load);
 };
 loadingFrame=requestAnimationFrame(load);
}
if(initialRoute==='/home/top'&&!history.state?.scroll)replayHeroEntrance();

observeVideos();
heroTypingFrame=requestAnimationFrame(updateHeroTyping);
observeMedia();
new MutationObserver(records=>{
 for(const record of records){
  for(const node of record.addedNodes)if(node.nodeType===1)observeMedia(node);
  for(const node of record.removedNodes)if(node.nodeType===1)for(const media of [node,...node.querySelectorAll('video,[data-media-src]')]){mediaLoadObserver.unobserve(media);mediaPlaybackObserver.unobserve(media);}
 }
}).observe(root,{childList:true,subtree:true});
document.documentElement.dataset.siteReady='true';
})();
