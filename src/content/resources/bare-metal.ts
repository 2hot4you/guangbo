import type {ResourceCard} from "../types";

export const bareMetalResources = [
  {
    id: "deepblue-bz-4002",
    name: "DeepBlue bz-4002",
    category: "GPU 裸金属",
    meta: "2U 机型｜64 位 CentOS 7.9｜Edgeray IaaS",
    specifications: [
      {label: "处理器", value: "双路 Intel® Xeon® Gold 6133（单颗 2.5 GHz、20 核 40 线程）"},
      {label: "内存", value: "DDR4 512 GB（64 GB × 8）"},
      {label: "GPU", value: "RTX 3090 涡轮版 × 2"},
      {label: "系统与平台", value: "64 位 CentOS 7.9｜Edgeray IaaS"},
      {label: "存储", value: "480 GB M.2 SSD × 1；4 TB U.2 NVMe SSD（2.5 英寸）× 1"},
      {label: "网络", value: "1GbE 电口 × 1；10GbE 光口 × 4；板载电口 × 1"},
    ],
    pricing: [
      {label: "整机双卡", value: "参考价 ¥1,200/月"},
      {label: "单卡", value: "参考价 ¥600/月或 ¥20/天"},
    ],
    workloads: "可评估用于 FP16 / INT4 推理、LoRA、Stable Diffusion、SDXL、Flux、RAG、视频剪辑、渲染及 3D 建模等任务；实际性能需结合模型、数据量和软件环境评估。",
    contacts: ["15390073913", "19382091612"],
    notice: "库存、价格、端口与开通条件以实际确认为准。",
  },
] as const satisfies readonly ResourceCard[];
