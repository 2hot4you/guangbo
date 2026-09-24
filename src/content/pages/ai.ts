import type {MarketingPage} from "../types";

export const ai = {
  key: "ai", path: "/ai",
  hero: {title: "从语言理解，到图像与视频创作", lead: "面向开发者、企业应用与内容生产场景，光波互联围绕国内外模型生态，提供模型能力介绍与API接入咨询。按任务选择语言、图像或视频模型，将所需能力连接到自己的产品与工作流程。"},
  sections: [
    {id: "capability-map", title: "三类模型能力", eyebrow: "01 / CAPABILITY MAP", body: "先从任务出发，再选择输入与输出能力。语言、图像和视频对应不同的创作与理解流程。", items: [
      {title: "LLM与多模态理解", body: "用于对话问答、文本写作、代码辅助、内容分析和信息提取。具备相应能力的型号还可处理图像、文档或视频输入，为业务应用提供理解与推理能力。", href: "/ai/llm"},
      {title: "图像生成与编辑", body: "围绕文本描述或参考图片生成视觉素材，按模型能力开展图片编辑、风格调整与多版本创作，服务商品展示、营销设计和内容生产。", href: "/ai/image"},
      {title: "视频生成与编辑", body: "从文字脚本、参考图片或视频素材出发，开展镜头创作、画面动态化及视频编辑。参考输入、音频、时长与输出规格随具体型号而不同。", href: "/ai/video"},
    ]},
    {id: "ecosystem", title: "探索国内外模型生态", eyebrow: "02 / MODEL ECOSYSTEM", body: "以下品牌与系列用于能力介绍，不表示所有分支都已开放；当前可调用型号、开放能力及价格以平台目录为准。", items: [
      {title: "国内语言与多模态系列", body: "DeepSeek、GLM、Kimi、MiniMax、Qwen、腾讯混元HY、MiMo、Doubao／Seed、ERNIE、讯飞星火、Step。"},
      {title: "国际语言与多模态系列", body: "OpenAI GPT、Anthropic Claude、Google Gemini，以及xAI Grok、Meta Llama、Mistral、Google Gemma、Cohere Command。"},
      {title: "图像生成系列", body: "Seedream、Qwen Image、Wan图像模型、混元图像模型、MiniMax图像模型，以及GPT Image、Gemini图像模型、FLUX、Stable Image／Stable Diffusion等。"},
      {title: "视频生成系列", body: "Seedance、Wan、可灵Kling、海螺Hailuo、HunyuanVideo、CogVideoX，以及Veo、Sora、Grok Imagine Video、Runway、Luma Ray等。"},
    ]},
    {id: "workflows", title: "从任务输入到业务复核", eyebrow: "03 / WORKFLOW", body: "把模型输出放进可检查的流程，明确输入材料、生成目标与最终负责人。", items: [
      {title: "准备输入", body: "整理任务目标、背景资料与可使用的参考素材。"},
      {title: "选择模型", body: "根据输入类型、输出形式与业务限制验证候选型号。"},
      {title: "生成与迭代", body: "以业务样例对比输出，并调整提示、参数或参考内容。"},
      {title: "业务复核", body: "由业务负责人校对事实、版权、品牌表达与使用合规。"},
    ]},
    {id: "scenarios", title: "把模型能力用在实际业务中", eyebrow: "04 / SCENARIOS", items: [
      {title: "企业应用", body: "为客服、知识查询、信息提取和业务流程增加语言理解能力。"},
      {title: "开发与分析", body: "为代码辅助、文档整理和结构化处理选择合适的模型与上下文配置。"},
      {title: "营销与设计", body: "将文字创意转为图片，围绕商品、活动和品牌内容组织视觉素材。"},
      {title: "视频内容", body: "将脚本与参考素材转为镜头片段，支撑产品展示、分镜预演和短视频制作。"},
    ]},
    {id: "selection", title: "按业务目标比较模型", eyebrow: "05 / SELECTION", body: "先确定输出目标，再用同一批业务样例比较候选模型。不同类型模型的参数和调用流程可能不同。", items: [
      {title: "输出效果", body: "检查准确性、风格与可编辑程度是否满足业务目标。"},
      {title: "输入条件", body: "核对文本长度、参考图片、文档或视频等支持范围。"},
      {title: "处理速度", body: "按交互响应或批量生产场景评估等待时间。"},
      {title: "集成方式", body: "确认调用方式、返回格式、错误处理与现有系统的适配。"},
      {title: "使用成本", body: "对照目录计费规则与预估用量，计算业务运行成本。"},
    ]},
    {id: "integration", title: "从样例验证走向接口集成", eyebrow: "06 / INTEGRATION", body: "在正式接入前，以实际业务样例检查输出质量和应用边界。", items: [
      {title: "提交业务样例", body: "准备典型输入、期望输出和不适用的边界情况。"},
      {title: "验证候选型号", body: "比较效果、速度、输入限制和使用成本。"},
      {title: "连接业务应用", body: "按所选型号的接口说明完成密钥管理、调用与错误处理。"},
      {title: "观察运行用量", body: "结合调用记录和费用变化调整模型及流程。"},
    ]},
    {id: "governance", title: "把使用边界写进工作流程", eyebrow: "07 / GOVERNANCE", body: "模型是业务流程中的一环。数据范围、密钥使用与结果复核需要由应用方明确。", items: [
      {title: "密钥与权限", body: "按岗位管理API密钥，不在前端代码或公开资料中暴露。"},
      {title: "输入数据", body: "提交资料前确认敏感信息、授权范围与业务数据使用要求。"},
      {title: "人工复核", body: "对对外发布或影响业务决策的结果保留人工校对。"},
      {title: "合规责任", body: "素材版权、内容审查与最终使用方式由业务方按场景确认。"},
    ]},
    {id: "availability", title: "查看具体型号，再决定接入", eyebrow: "08 / AVAILABILITY", body: "本页展示的是模型生态与选型方法。实际开放型号与价格以平台目录为准，输入输出能力按具体型号确认。", items: [
      {title: "了解语言与多模态模型", body: "查看文本、代码与多模态理解方向。", href: "/ai/llm"},
      {title: "了解图像模型", body: "查看图像生成、编辑与参考输入方向。", href: "/ai/image"},
      {title: "了解视频模型", body: "查看视频生成、编辑与输出规格方向。", href: "/ai/video"},
    ]},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const aiLlm = {
  key: "aiLlm", path: "/ai/llm",
  hero: {title: "为应用加入理解、推理与表达能力", lead: "围绕文本、代码与多模态内容，按业务场景选择模型。无论是整理资料、提取信息，还是构建应用中的问答与辅助功能，都从输入内容和输出目标出发。"},
  sections: [
    {id: "directions", title: "主要应用方向", items: [
      {title: "对话与写作", body: "生成回复、整理摘要、改写文本和准备业务文稿。"},
      {title: "推理与代码", body: "辅助分析复杂问题、理解代码、生成实现建议与处理开发文档。"},
      {title: "文档与信息提取", body: "从给定资料中整理要点、提取字段，生成便于业务系统处理的内容。"},
      {title: "多模态理解", body: "对具备相应能力的型号提交图片、文档或视频，开展内容问答与分析。"},
    ]},
    {id: "domestic-models", title: "国内模型系列", items: [
      {title: "DeepSeek", body: "对话、推理与代码任务；按型号选择文本或视觉输入能力"},
      {title: "GLM", body: "通用语言处理、推理与编程；视觉能力按具体分支选择"},
      {title: "Kimi", body: "长文档处理、代码与推理，部分型号提供图片和视频理解"},
      {title: "MiniMax", body: "语言、编程与智能体相关任务，多模态输入按型号确认"},
      {title: "Qwen／千问", body: "通用语言、代码与多模态系列，可按文本、视觉或全模态任务选型"},
      {title: "HY／Hunyuan／腾讯混元", body: "语言理解与生成，并有视觉理解等不同分支"},
      {title: "MiMo／小米", body: "推理、代码与多模态方向，适用于应用和智能体任务选型"},
      {title: "Doubao／Seed／豆包", body: "语言、推理与多模态理解；与Seedream、Seedance生成系列分开选择"},
      {title: "ERNIE／文心", body: "中文及通用文本生成、业务内容处理等任务"},
      {title: "讯飞星火／Spark", body: "对话、文本处理和知识问答等应用方向"},
      {title: "Step／阶跃", body: "语言、推理、代码与多模态方向，具体能力按型号选择"},
    ]},
    {id: "international-models", title: "国际模型系列", body: "此处介绍模型系列，不表示所有分支均已在平台开放。请以可用模型目录中的具体型号、输入输出类型及接入说明为准。", items: [
      {title: "OpenAI GPT", body: "通用语言、多模态理解、推理与代码相关任务"},
      {title: "Anthropic Claude", body: "文档分析、语言推理、代码与视觉理解等任务"},
      {title: "Google Gemini", body: "语言、代码与多模态理解；图像输出需选择相应生成型号"},
      {title: "xAI Grok", body: "对话、推理、代码与视觉理解等任务"},
      {title: "Meta Llama", body: "面向开发与定制部署的开放权重系列，部署方式和许可按版本确认"},
      {title: "Mistral", body: "通用语言、代码及部分多模态任务，可按具体产品选型"},
      {title: "Google Gemma", body: "开放模型系列，适合评估部署、适配与定制需求"},
      {title: "Cohere Command", body: "企业语言处理、问答与检索增强相关应用"},
    ]},
    {id: "selection", title: "选择模型时关注什么", items: [
      {title: "任务效果", body: "用真实业务样例比较结果质量和指令遵循情况。"},
      {title: "上下文与输入", body: "确认文本长度、文件处理方式及图片或视频输入支持情况。"},
      {title: "集成能力", body: "根据应用需要确认结构化输出、工具调用与流式输出等能力。"},
      {title: "用量与成本", body: "结合输入输出规模、响应时间和实际价格评估使用成本。"},
    ]},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const aiImage = {
  key: "aiImage", path: "/ai/image",
  hero: {title: "将文字创意转为视觉素材", lead: "从文字描述、商品图片或设计参考出发，选择适合的图像模型。围绕内容生成与素材编辑，帮助团队组织营销图片、创意草图和多版本设计素材。"},
  sections: [
    {id: "methods", title: "常见创作方式", items: [
      {title: "文生图", body: "用文字描述主体、场景、构图和风格，生成视觉草稿或内容素材。"},
      {title: "参考图生成", body: "在支持参考输入的模型中，用图片辅助表达人物、商品或画面风格。"},
      {title: "图像编辑", body: "按型号支持的范围调整背景、局部元素或整体效果。"},
      {title: "版本探索", body: "围绕同一创意尝试不同构图与表达，再进行筛选和后期加工。"},
    ]},
    {id: "models", title: "主要图像模型系列", body: "这里展示的是模型生态。分辨率、参考图数量、编辑方式和生成数量均由具体型号决定；当前可调用范围以平台目录为准。", items: [
      {title: "Seedream", body: "图像生成与编辑，支持的参考方式按型号选择"},
      {title: "Qwen Image", body: "文字到图像及图像编辑相关能力"},
      {title: "Wan／万相图像模型", body: "万相生态中的图像生成能力，与视频型号区分"},
      {title: "HY／混元图像模型", body: "文生图、参考图生成与图像处理方向"},
      {title: "MiniMax图像模型", body: "图像创作及参考生成等方向，按开放型号确认"},
      {title: "GPT Image／OpenAI", body: "图像生成与编辑，适用于将文字和参考素材转为图像"},
      {title: "Gemini图像模型／Google", body: "原生图像生成与编辑，常见产品称呼包括Nano Banana，接入时使用确切型号"},
      {title: "FLUX／Black Forest Labs", body: "图像生成、编辑与参考图工作流"},
      {title: "Stable Image／Stable Diffusion", body: "图像生成与处理，可按产品评估API或适用的部署方式"},
    ]},
    {id: "scenarios", title: "适用场景", items: [
      {title: "电商商品素材", body: "探索商品背景、场景搭配与营销构图。"},
      {title: "活动与品牌设计", body: "准备海报背景、宣传配图和不同风格的视觉方案。"},
      {title: "内容创作", body: "为文章、社交媒体和故事内容准备插画或场景素材。"},
      {title: "视频前期制作", body: "先形成角色、场景和关键帧参考，再进入后续视频制作流程。"},
    ]},
    {id: "requirements", title: "让创作需求更清楚", body: "提供用途、画幅、主体、风格与参考素材，可以帮助确定适合的模型及参数。产品文字、标识与最终版式可在生成后继续校对和设计。"},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const aiVideo = {
  key: "aiVideo", path: "/ai/video",
  hero: {title: "从脚本与参考素材，开始镜头创作", lead: "围绕文字、图片或视频输入，评估适合的视频模型。将创意描述转为动态片段，用于产品展示、广告创意、分镜预演和内容制作。"},
  sections: [
    {id: "methods", title: "按任务选择生成方式", items: [
      {title: "文生视频", body: "描述主体、动作、环境和镜头运动，生成视频片段。"},
      {title: "图生视频", body: "以静态图片为起点，为人物、商品或场景增加动态表现。"},
      {title: "参考与编辑", body: "在支持的型号中使用参考素材、首尾帧、视频编辑或延长功能。"},
      {title: "音画创作", body: "部分型号支持带声音的视频输出，配音、音乐及音效能力需按具体模型确认。"},
    ]},
    {id: "domestic-models", title: "国内视频模型系列", items: [
      {title: "Seedance", body: "文本、图片及其他参考素材驱动的视频创作，音画与编辑能力依型号而定"},
      {title: "Wan／万相", body: "文生视频、图生视频及相关视频编辑方向"},
      {title: "Kling／可灵", body: "视频生成系列，面向镜头与动态内容创作"},
      {title: "Hailuo／海螺／MiniMax", body: "视频生成系列，按具体型号评估参考输入和镜头表现"},
      {title: "HunyuanVideo／混元视频", body: "文生视频与图生视频等方向，区分开放模型与API服务"},
      {title: "CogVideoX", body: "视频生成系列，可按版本和服务方式评估接入或部署"},
    ]},
    {id: "international-models", title: "国际视频模型系列", body: "以上介绍不等于平台实时可用目录。具体开放型号、任务限制和价格以平台公示为准。", items: [
      {title: "Veo／Google", body: "视频生成系列，按型号选择参考输入、声音与输出规格"},
      {title: "Sora／OpenAI", body: "视频生成系列，文本或图片驱动的视频创作"},
      {title: "Grok Imagine Video／xAI", body: "视频生成与编辑，输入方式和声音能力依型号确认"},
      {title: "Runway", body: "视频生成与编辑产品，按Gen或编辑系列的具体型号选择"},
      {title: "Luma Ray", body: "视频生成系列，支持的图像参考与镜头控制依型号确认"},
    ]},
    {id: "scenarios", title: "用于业务中的哪些环节", items: [
      {title: "商品展示", body: "围绕商品图与使用场景生成动态展示素材。"},
      {title: "广告与短视频", body: "探索不同创意、镜头和视觉风格，形成可继续剪辑的片段。"},
      {title: "影视与动画前期", body: "将脚本、角色与场景参考转为分镜和动态预演。"},
      {title: "图文内容动态化", body: "为已有图片和内容增加运动与叙事表达。"},
    ]},
    {id: "requirements", title: "在创作前确认输出要求", body: "先确认画幅、时长、分辨率、声音需求和参考素材，再选择适合的模型。视频生成通常按任务执行，完成时间和计费方式随型号及配置而不同。"},
  ], contactEnabled: false,
} satisfies MarketingPage;
