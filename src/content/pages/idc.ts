import type {MarketingPage} from "../types";

export const idc = {
  key: "idc", path: "/idc",
  hero: {title: "为业务选择合适的计算与托管方式", lead: "从虚拟服务器到独享物理设备，从单台托管到机柜与GPU集群，光波互联结合数据中心合作资源，为企业匹配部署地点、计算性能、供电条件与网络接入方案。"},
  sections: [
    {id: "services", title: "四类服务，适配不同部署需求", items: [
      {title: "VPS租赁", body: "网站、接口服务、开发测试与轻量业务", meta: "vCPU、内存、存储、带宽和部署地域", href: "/idc/vps"},
      {title: "裸金属租赁", body: "数据库、企业核心应用及独享计算环境", meta: "CPU、内存、磁盘、网络与管理方式", href: "/idc/bare-metal"},
      {title: "机柜与托管", body: "自有设备部署、集中运维与基础设施扩容", meta: "机柜空间、供电容量、制冷和运营商接入", href: "/idc/colocation"},
      {title: "GPU算力", body: "AI训练、推理、渲染与行业计算", meta: "GPU型号、显存、互联、存储及软件环境", href: "/idc/gpu"},
    ]},
    {id: "conditions", title: "不只看计算规格，也看整体部署条件", items: [
      {title: "部署地域", body: "结合用户分布、访问路径与运维条件，评估业务部署位置。"},
      {title: "电力与制冷", body: "根据设备功耗、机柜密度及运行负载选择承载条件，明确供电和制冷保障方案。"},
      {title: "网络连接", body: "按业务选择互联网接入、机房互联或专线连接，兼顾日常访问与数据传输需求。"},
      {title: "运行管理", body: "结合资源类型确定监控、设备维护、故障处理和服务交接方式。"},
    ]},
    {id: "scenarios", title: "典型方案", items: [
      {title: "企业应用部署", body: "按照业务规模组合计算、存储与网络资源，承载网站、接口和内部系统。"},
      {title: "跨机房互联", body: "将不同地点的服务器与数据中心通过网络连接起来，支撑数据交换与业务协同。"},
      {title: "AI计算部署", body: "将GPU服务器、存储和网络需求一并评估，避免只按显卡数量选型。"},
      {title: "托管迁移与扩容", body: "围绕上架空间、电力、布线和业务切换安排，评估迁移或扩容方案。"},
    ]},
    {id: "delivery", title: "按实际需求确认交付", body: "提供目标地域、设备或业务配置、预计使用时间，我们将据此沟通资源可用性与实施安排。具体配置及服务指标以选定节点和交付方案为准。"},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const idcVps = {
  key: "idcVps", path: "/idc/vps",
  hero: {title: "让应用从合适的计算资源开始", lead: "面向网站、接口服务、开发测试和轻量业务，提供VPS资源选型与租赁咨询。根据访问地域、应用负载和预算，选择适合的计算、存储与网络组合。"},
  sections: [
    {id: "applications", title: "面向实际应用的配置选择", items: [
      {title: "网站与接口服务", body: "围绕访问量、并发需求和数据规模，评估计算与带宽配置。"},
      {title: "开发与测试环境", body: "为应用开发、功能验证和测试任务选择相对独立的运行环境。"},
      {title: "中小型业务系统", body: "结合数据库、后台服务和文件存储需求，规划初期资源及后续调整方式。"},
    ]},
    {id: "criteria", title: "选型时，一起确认这些信息", items: [
      {title: "计算", body: "vCPU与内存是否匹配业务负载"},
      {title: "存储", body: "可用容量、磁盘性能与数据保存需求"},
      {title: "网络", body: "接入线路、带宽、流量及IP需求"},
      {title: "环境", body: "操作系统和业务软件的适配要求"},
      {title: "服务", body: "使用周期、数据备份安排和故障处理范围"},
    ]},
    {id: "expansion", title: "从小规模部署到后续扩展", body: "先围绕当前业务配置资源，再根据运行情况评估调整。涉及数据迁移、停机窗口或应用改造的扩容需求，在变更前共同确认实施方式。"},
    {id: "delivery", title: "获取适合你的配置方案", body: "告诉我们应用类型、目标地域和大致访问规模，即可开始选型沟通。可选节点、套餐及开通安排以实际资源确认为准。"},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const idcBareMetal = {
  key: "idcBareMetal", path: "/idc/bare-metal",
  hero: {title: "独享物理资源，按业务配置运行环境", lead: "面向数据库、企业应用和持续计算任务，提供裸金属服务器选型与租赁咨询。结合处理器、内存、磁盘和网络需求，匹配适合的物理服务器与部署环境。"},
  sections: [
    {id: "applications", title: "为需要独立资源的业务提供选择", items: [
      {title: "数据库与数据处理", body: "关注内存容量、磁盘性能及数据增长，匹配应用对计算和存储的需求。"},
      {title: "企业业务系统", body: "根据部署规范与软件要求，确定硬件配置、操作环境及网络连接方式。"},
      {title: "自建计算环境", body: "面向需要自行规划运行环境的团队，评估设备配置及管理需求。"},
    ]},
    {id: "infrastructure", title: "从服务器到机房，一起规划", body: "服务器配置决定计算能力，部署环境影响业务运行。选型过程中同步考虑机房位置、带宽、供电、设备管理和维护安排，让硬件与基础设施相互匹配。"},
    {id: "boundaries", title: "明确配置，也明确服务边界", body: "在方案中列明硬件清单、网络配置、交付环境、使用周期及设备故障处理方式。涉及硬件更换、数据迁移或系统操作时，提前确认责任分工与执行条件。"},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const idcColocation = {
  key: "idcColocation", path: "/idc/colocation",
  hero: {title: "让自有设备获得合适的运行空间", lead: "光波互联整合数据中心合作资源，面向服务器、网络设备及计算集群，开展机柜租赁、设备托管、网络接入与配套服务对接。围绕设备数量、功耗和连接需求，选择适合的机房与交付方式。"},
  sections: [
    {id: "scales", title: "按部署规模选择服务", items: [
      {title: "设备托管", body: "围绕设备上架、供电与网络接入，确认托管条件和操作流程。"},
      {title: "整柜租赁", body: "为集中部署的设备规划机柜、电力、布线与配套空间。"},
      {title: "高功率部署", body: "针对高密度服务器与GPU设备，重点评估电力容量、散热方式及机柜承重。"},
      {title: "定制区域", body: "对有独立空间、专属布线或特殊交付要求的项目，评估模块或区域定制方案。"},
    ]},
    {id: "regions", title: "资源选址方向", body: "更多地区可按项目沟通，具体站点和资源余量以勘察及确认为准。", items: [
      {title: "成都及周边", body: "结合城区与园区型数据中心资源，评估网络接入、驻场协作和高密度部署需求。"},
      {title: "宜宾、眉山等川内节点", body: "结合区域业务布局，评估机柜托管与算力基础设施需求。"},
      {title: "青海、宁夏等西部节点", body: "结合业务时延、数据传输与运行条件，评估集中计算及数据存储的部署方案。"},
    ]},
    {id: "criteria", title: "从五个维度评估机房", items: [
      {title: "供电保障", body: "核对市电接入、UPS、备用电源及设备双路供电条件。"},
      {title: "制冷条件", body: "结合设备负载选择风冷、水冷或其他适用方案，关注气流组织与冗余配置。"},
      {title: "网络接入", body: "确认运营商、进纤路由、互联网出口及机房互联条件。"},
      {title: "环境与安全", body: "关注门禁、视频监控、消防、漏水检测及设备进出管理。"},
      {title: "运维配套", body: "明确监测告警、巡检、远程协助和现场操作流程。"},
    ]},
    {id: "scenarios", title: "典型方案", items: [
      {title: "企业集中托管", body: "将分散设备集中部署，配套网络连接和日常维护安排。"},
      {title: "高密度计算托管", body: "以设备功耗为起点，同时规划机柜、电力、散热和网络。"},
      {title: "异地部署", body: "结合业务连续性目标评估异地资源、数据传输与恢复安排。"},
    ]},
  ], contactEnabled: false,
} satisfies MarketingPage;

export const idcGpu = {
  key: "idcGpu", path: "/idc/gpu",
  hero: {title: "面向AI与行业计算，组合所需算力", lead: "围绕模型训练、推理服务、图形渲染及行业计算，提供GPU算力租赁与部署方案对接。从任务特点出发，同步考虑GPU、显存、存储、网络和运行环境。"},
  sections: [
    {id: "tasks", title: "以任务决定配置", items: [
      {title: "模型训练与微调", body: "结合模型规模、数据集和训练方式，评估显存容量、多卡协同与数据读取需求。"},
      {title: "推理服务", body: "围绕模型大小、响应需求和并发负载，选择计算资源及部署方式。"},
      {title: "图形与行业计算", body: "结合渲染或计算软件的适配情况，评估设备和运行环境。"},
    ]},
    {id: "deployment", title: "多种部署方向", items: [
      {title: "远程租赁", body: "适合希望使用外部计算资源的团队，按需求确认资源配置与使用周期。"},
      {title: "设备托管", body: "为已有GPU设备的客户匹配供电、制冷、网络和现场服务条件。"},
      {title: "本地部署", body: "结合企业现场环境与数据管理要求，评估工作站、服务器或集群方案。"},
    ]},
    {id: "connections", title: "不同规模，采用不同连接方式", body: "单机部署重点关注GPU与显存配置；多机部署还需要评估计算互联、共享存储和数据传输。高密度设备同时核对电力、制冷与维护条件，形成与任务相匹配的配置方案。"},
    {id: "delivery", title: "先验证关键负载，再确定资源规模", body: "提供模型、软件环境、任务周期及性能目标，我们将据此开展资源匹配与方案沟通。具体GPU型号、供应规模和测试安排以项目确认为准。"},
  ], contactEnabled: false,
} satisfies MarketingPage;
