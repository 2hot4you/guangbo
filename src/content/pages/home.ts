import type {MarketingPage} from "../types";

export const home = {
  key: "home",
  path: "/",
  hero: {
    title: "让大模型走进应用，让创意成为内容",
    lead: "从LLM语言理解到AI生图、生视频，光波互联为开发者与企业梳理国内外模型能力，提供API服务入口与接入咨询。以模型能力连接应用，以算力、网络和绿色能源支撑业务发展。",
  },
  sections: [
    {
      id: "ai",
      title: "大模型与AIGC：网站第一业务板块",
      items: [
        {title: "LLM与多模态理解", body: "围绕问答、写作、代码、推理与内容分析选择模型，将理解与表达能力连接到企业应用。代表系列：DeepSeek、GLM、Kimi、MiniMax、Qwen、HY混元、MiMo、Doubao／Seed，以及OpenAI GPT、Anthropic Claude、Google Gemini、xAI Grok等。", href: "/ai/llm"},
        {title: "AI图像生成与编辑", body: "将文字或参考图片转为视觉素材，服务商品展示、创意设计与营销内容生产。代表系列：Seedream、Qwen Image、Wan图像模型、HY混元图像模型，以及GPT Image、Gemini图像模型、FLUX、Stable Diffusion等。", href: "/ai/image"},
        {title: "AI视频生成与编辑", body: "从脚本、图片与参考素材出发，探索动态镜头、商品视频和故事片段。代表系列：Seedance、Wan、Kling可灵、Hailuo海螺、HunyuanVideo，以及Veo、Sora、Grok Imagine Video、Runway、Luma Ray等。", href: "/ai/video"},
      ],
    },
    {id: "model-ecosystem", title: "模型生态", body: "模型名称用于能力介绍，实际可调用的型号及价格以平台目录为准。"},
    {id: "idc", title: "IDC与算力", body: "面向网站应用、企业系统及AI计算，提供VPS、裸金属、机柜托管与GPU算力资源对接，结合部署地域、性能需求和预算进行选型。", items: [
      {title: "VPS租赁", body: "网站、接口服务、开发测试与轻量业务", href: "/idc/vps"},
      {title: "裸金属租赁", body: "数据库、企业核心应用及独享计算环境", href: "/idc/bare-metal"},
      {title: "机柜与托管", body: "自有设备部署、集中运维与基础设施扩容", href: "/idc/colocation"},
      {title: "GPU算力", body: "AI训练、推理、渲染与行业计算", href: "/idc/gpu"},
    ]},
    {id: "madeinchina", title: "信创与企业数字化", body: "围绕计算硬件、业务应用与数据保护，组织软硬件选型和适配评估，连接企业现有系统与新的业务需求。", items: [{title: "信创与企业数字化", body: "以现有系统和业务目标为起点，评估软硬件适配、部署方式及后续扩展。", href: "/madeinchina"}]},
    {id: "network", title: "专线网络", body: "面向总部与分支、数据中心和云端资源，提供专线、光纤及组网方案咨询，兼顾传输需求、接入条件与后续扩展。", items: [{title: "全国专线租赁", body: "根据两端地址、带宽与业务要求，选择合适的接入与传输方式。", href: "/network"}]},
    {id: "energy", title: "绿电与清洁能源", body: "结合企业用电特点，开展绿电采购、绿证需求、能源管理及节能项目对接，让能源规划与业务增长同步推进。", items: [{title: "绿电与清洁能源", body: "结合用电结构、负荷特点和经营计划，评估适合的能源服务组合。", href: "/energy"}]},
    {id: "delivery", title: "从需求到交付，让方案落到业务上", body: "先明确业务目标，再确定资源配置。我们围绕部署地点、容量、网络、安全与成本，与项目相关方共同评估方案，并在交付前明确配置、服务范围及验收要求。"},
    {id: "about", title: "告诉我们，你的业务需要什么", body: "无论是部署一套应用、连接多个办公地点，还是规划算力与能源项目，都可以从一次需求沟通开始。"},
  ],
  contactEnabled: false,
} satisfies MarketingPage;
