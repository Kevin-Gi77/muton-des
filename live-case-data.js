// 四张完整竖屏成品的外置标注与案例阅读层级，仅用于本地预览。
{
  const editorial = window.MUTON_CONTENT.liveEditorial;
  const layouts = {
    'live-04': {
      title: '一张直播画面里，品牌、预约权益和新车各有主次',
      callouts: [
        {side:'left', x:.49, y:.08, name:'品牌识别', purpose:'先确认吉利银河的品牌来源'},
        {side:'right', x:.52, y:.14, name:'直播主题', purpose:'“想象不止 体验不止”建立发布语境'},
        {side:'left', x:.25, y:.23, name:'预约权益卡', purpose:'固定信息容器承接轮播内容'},
        {side:'right', x:.77, y:.22, name:'新品预览', purpose:'用侧前方视角补充车身造型'},
        {side:'left', x:.25, y:.47, name:'银河氛围', purpose:'星体、远山与水面连接科技感'},
        {side:'right', x:.55, y:.63, name:'核心车型', purpose:'放大正面车图，突出车身轮廓'},
        {side:'left', x:.50, y:.95, name:'底部品牌语', purpose:'在观看末端收束整场表达'}
      ],
      steps: [
        ['信息排序','先让用户认出新品与活动'],
        ['核心车型','用开阔环境放大车身轮廓'],
        ['下部收束','控制信息密度并保留品牌余韵'],
        ['交付检查','让权益更新不打断主体画面']
      ],
      summary: ['这张画面最重要的取舍，是让权益更新发生在固定上贴，让车辆保持不被干扰的视觉中心。品牌和主题负责建立语境，远山与水面负责科技空间，底部品牌语负责收尾。', '以上为基于成品画面的设计拆解。素材不包含完整制作过程和效果数据；权益滚动方式依据已确认的项目说明。']
    },
    'live-05': {
      title: '让价格、车辆、人物和服务沿一条观看路径展开',
      callouts: [
        {side:'left', x:.48, y:.09, name:'活动主题', purpose:'用高亮灯牌制造直播间记忆点'},
        {side:'right', x:.43, y:.18, name:'车型与价格', purpose:'首屏快速交代 F2Z110 MAX 与活动价'},
        {side:'left', x:.27, y:.29, name:'权益贴片', purpose:'在主题下方补充限时优惠'},
        {side:'right', x:.80, y:.30, name:'赠品侧卡', purpose:'把下单赠礼放在固定侧边'},
        {side:'left', x:.46, y:.47, name:'环形科技场景', purpose:'将人物讲解聚焦在舞台中央'},
        {side:'right', x:.56, y:.67, name:'实车主体', purpose:'用大尺度前景强化产品感'},
        {side:'left', x:.82, y:.73, name:'品牌联动提示', purpose:'独立叠加活动人物与提醒信息'},
        {side:'right', x:.53, y:.96, name:'服务下贴', purpose:'归纳下单、提车与售后路径'}
      ],
      steps: [
        ['信息排序','把车型权益放在第一阅读层'],
        ['主体与侧贴','让车辆和人物保持第一观看尺度'],
        ['服务下贴','将购买路径归纳为三项'],
        ['交付检查','核对站位、权益与平台安全区']
      ],
      summary: ['上贴承担车型、价格和活动权益；中部的环形舞台把讲解人物与车辆放在一起；赠品和品牌提示沿侧边叠放；下贴将购买后的服务路径说清。信息多，但每一类都有稳定的位置。', '本页依据现有成品和已确认的权益轮播说明拆解，未据此推定实际转化表现。']
    },
    'live-06': {
      title: '从材质主张到使用场景，逐层回答购买顾虑',
      callouts: [
        {side:'left', x:.52, y:.16, name:'直播主题', purpose:'用大字建立钛咖杯的第一记忆点'},
        {side:'right', x:.49, y:.23, name:'材质信任', purpose:'把纯钛板材放在首屏阅读层'},
        {side:'left', x:.28, y:.39, name:'暖金氛围', purpose:'咖啡空间平衡金属杯具的冷感'},
        {side:'right', x:.81, y:.38, name:'侧贴核心卖点', purpose:'双饮口、容量与配送便于讲解查找'},
        {side:'left', x:.21, y:.51, name:'品牌路牌', purpose:'把康巴赫识别融进真实场景'},
        {side:'right', x:.77, y:.54, name:'产品融合', purpose:'陈列杯款与咖啡机，强化使用想象'},
        {side:'left', x:.49, y:.94, name:'下贴深化卖点', purpose:'再次回应高温久泡与材质顾虑'}
      ],
      steps: [
        ['需求拆解','先回答为什么选择这只杯'],
        ['场景建立','用暖金色平衡材质的冷感'],
        ['上贴与侧卡','把品牌主张和购买信息分开'],
        ['下贴与验证','在最后一屏承接顾虑']
      ]
    },
    'live-07': {
      title: '一口锅的性能、演示和赠礼，用稳定分区说清',
      callouts: [
        {side:'left', x:.50, y:.13, name:'直播主题', purpose:'用红白主张锁定钛蜂窝产品'},
        {side:'right', x:.51, y:.19, name:'活动提示', purpose:'把限时下单信息独立成带'},
        {side:'left', x:.19, y:.30, name:'性能侧贴', purpose:'四项短句集中回答产品疑问'},
        {side:'right', x:.78, y:.34, name:'烹饪演示区', purpose:'用锅面使用画面承接性能说明'},
        {side:'left', x:.19, y:.51, name:'三重赠礼', purpose:'锅盖、蒸屉、铁铲形成下单理由'},
        {side:'right', x:.41, y:.47, name:'锅具主体', purpose:'在舞台前景保持完整产品轮廓'},
        {side:'left', x:.48, y:.94, name:'下贴主张', purpose:'在底部再次强调涂层与不粘信息'}
      ],
      steps: [
        ['需求拆解','同时解决“信不信”与“值不值”'],
        ['视觉基调','红白舞台突出产品轮廓'],
        ['上贴与性能','从一句主张进入证据'],
        ['演示与权益','让证明和促销互不抢位'],
        ['下贴与检查','让最后一层信息能被看清']
      ]
    }
  };
  for (const [uid, layout] of Object.entries(layouts)) {
    const sections = editorial[uid].sections;
    sections[0].title = layout.title;
    sections[0].callouts = layout.callouts;
    sections[0].caption = '线条标注依据完整成品画面整理，用于说明各区域的视觉作用；非原始分层文件。';
    delete sections[0].regions;
    if (uid === 'live-04' || uid === 'live-05') {
      sections.push({title:'交付检查',layout:'text',items:[],paragraphs:[uid === 'live-04'
        ? '将品牌与主题保持固定，检查预约权益的轮播边界、车图遮挡、手机端可读性和底部品牌语。若活动文案变化，优先更新权益卡，而不牵动主体画面。'
        : '检查主播与车辆的站位、顶部价格信息、右侧赠礼贴片以及底部服务承诺是否被平台控件遮挡。权益变化应集中在预留容器，不打乱人物与实车的视觉中心。']});
      sections.push({title:'设计拆解总结',layout:'summary',items:[],paragraphs:layout.summary});
    } else if (uid === 'live-06') {
      sections.at(-1).title = '设计拆解总结';
      sections.at(-1).layout = 'summary';
    } else {
      const last = sections.at(-1);
      last.paragraphs = [last.paragraphs[0]];
      sections.push({title:'设计拆解总结',layout:'summary',items:[],paragraphs:[
        '从成品可反推的顺序是：确认性能卖点与活动规则，确定红白舞台和锅具站位，将性能条、演示区与赠礼卡拆为独立信息层，最后在手机画幅核对可读性、安全区与产品表述。',
        '素材包只提供成品截图，未提供过程稿与转化数据；这里呈现的是设计方法分析。'
      ]});
    }
    sections.filter(section => section.layout === 'text').forEach((section, index) => {
      const [kicker, headline] = layout.steps[index];
      section.step = String(index + 1).padStart(2, '0');
      section.kicker = kicker;
      section.headline = headline;
    });
  }
  const earlierCases = {
    'live-01': {
      title: '从活动主题到产品陈列，画面留给真实讲解',
      imageIndex: 1,
      callouts: [
        {side:'left',x:.49,y:.13,name:'夏日主题',purpose:'绿色大字让活动先被识别'},
        {side:'right',x:.74,y:.23,name:'活动与权益',purpose:'在固定区域分次说明福利'},
        {side:'left',x:.23,y:.43,name:'木色展架',purpose:'承接产品、奖项与品牌资料'},
        {side:'right',x:.62,y:.48,name:'人物空间',purpose:'中部保留讲解与动作区域'},
        {side:'left',x:.49,y:.72,name:'产品台面',purpose:'前景集中陈列当场主推商品'},
        {side:'right',x:.54,y:.92,name:'服务下贴',purpose:'在底部归纳保障和行动信息'}
      ],
      presentations: ['feature','strip-stack','scene-pair','small-piece','portrait-pair','portrait-single']
    },
    'live-02': {
      title: '以花朵、床品和服务信息，组织完整直播画面',
      imageIndex: 7,
      callouts: [
        {side:'left',x:.49,y:.12,name:'品质家居主题',purpose:'双品牌与活动标题建立入口'},
        {side:'right',x:.79,y:.26,name:'紫罗兰氛围',purpose:'花形与浅紫色统一场景'},
        {side:'left',x:.26,y:.46,name:'床品展示',purpose:'让材质和布置保持主角位置'},
        {side:'right',x:.72,y:.61,name:'人物留白',purpose:'直播讲解区不被贴片遮挡'},
        {side:'left',x:.51,y:.91,name:'服务下贴',purpose:'底部集中呈现保障与售后'}
      ],
      presentations: ['scene-trio','feature','strip-stack','small-piece','portrait-pair','portrait-single']
    },
    'project-31': {
      title: '元宵主题、厨电展示与活动权益各有位置',
      imageIndex: 15,
      callouts: [
        {side:'left',x:.49,y:.13,name:'元宵主题',purpose:'红金标题与灯笼建立节日记忆'},
        {side:'left',x:.19,y:.35,name:'互动与优惠',purpose:'券面在固定位置轮换讲解'},
        {side:'right',x:.77,y:.28,name:'厨电展台',purpose:'两侧放置产品，保留中央空间'},
        {side:'right',x:.53,y:.57,name:'人物主位',purpose:'让主播与现场讲解成为中心'},
        {side:'left',x:.52,y:.92,name:'服务下贴',purpose:'底部稳定承接下单与保障'}
      ],
      presentations: ['poster-trio','scene-pair','component-grid','mixed-preview','coupon-grid','portrait-pair','poster-trio']
    }
  };
  for (const [uid, layout] of Object.entries(earlierCases)) {
    const sections = editorial[uid].sections;
    sections[0].title = layout.title;
    sections[0].items = [layout.imageIndex];
    sections[0].callouts = layout.callouts;
    sections[0].caption = '线条标注依据完整直播画面整理，用于说明各区域的视觉作用。';
    sections.slice(1).forEach((section, index) => { section.presentation = layout.presentations[index]; });
    if (uid === 'live-02') sections[1].items = [1, 3, 2];
  }
}
