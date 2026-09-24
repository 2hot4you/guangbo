export type LobeCatalogCategory = "provider" | "model";
export interface LobeCatalogItem { readonly id: string; readonly name: string; readonly category: LobeCatalogCategory; }
export const LOBE_ICON_CATALOG_VERSION = "5.21.0";
export const lobeProviderCatalog = [
  {
    "id": "ZeroOne",
    "name": "01.AI (零一万物)",
    "category": "provider"
  },
  {
    "id": "Ai302",
    "name": "302.AI",
    "category": "provider"
  },
  {
    "id": "AgentVoice",
    "name": "AgentVoice",
    "category": "provider"
  },
  {
    "id": "AiStudio",
    "name": "AI Studio (Google)",
    "category": "provider"
  },
  {
    "id": "Ai360",
    "name": "Ai360 (360智脑)",
    "category": "provider"
  },
  {
    "id": "AiHubMix",
    "name": "AiHubMix (推理时代)",
    "category": "provider"
  },
  {
    "id": "AiMass",
    "name": "AiMass (紫东太初)",
    "category": "provider"
  },
  {
    "id": "AkashChat",
    "name": "AkashChat",
    "category": "provider"
  },
  {
    "id": "AlephAlpha",
    "name": "AlephAlpha",
    "category": "provider"
  },
  {
    "id": "Alibaba",
    "name": "Alibaba",
    "category": "provider"
  },
  {
    "id": "AlibabaCloud",
    "name": "AlibabaCloud (阿里云)",
    "category": "provider"
  },
  {
    "id": "AMDRadeonCloud",
    "name": "AMD Radeon Cloud",
    "category": "provider"
  },
  {
    "id": "Anspire",
    "name": "Anspire",
    "category": "provider"
  },
  {
    "id": "AntGroup",
    "name": "AntGroup",
    "category": "provider"
  },
  {
    "id": "Anthropic",
    "name": "Anthropic",
    "category": "provider"
  },
  {
    "id": "Anyscale",
    "name": "Anyscale",
    "category": "provider"
  },
  {
    "id": "Apertis",
    "name": "Apertis",
    "category": "provider"
  },
  {
    "id": "Apple",
    "name": "Apple",
    "category": "provider"
  },
  {
    "id": "AtlasCloud",
    "name": "AtlasCloud",
    "category": "provider"
  },
  {
    "id": "Aws",
    "name": "AWS",
    "category": "provider"
  },
  {
    "id": "AzureAI",
    "name": "AzureAI",
    "category": "provider"
  },
  {
    "id": "Baidu",
    "name": "Baidu",
    "category": "provider"
  },
  {
    "id": "BaiduCloud",
    "name": "BaiduCloud (百度智能云)",
    "category": "provider"
  },
  {
    "id": "Bailian",
    "name": "Bailian (阿里云百炼)",
    "category": "provider"
  },
  {
    "id": "Baseten",
    "name": "Baseten",
    "category": "provider"
  },
  {
    "id": "Bedrock",
    "name": "Bedrock (AWS)",
    "category": "provider"
  },
  {
    "id": "Bilibili",
    "name": "Bilibili (哔哩哔哩)",
    "category": "provider"
  },
  {
    "id": "Bfl",
    "name": "Black Forest Labs (bfl)",
    "category": "provider"
  },
  {
    "id": "Bocha",
    "name": "Bocha (博查)",
    "category": "provider"
  },
  {
    "id": "Brave",
    "name": "Brave",
    "category": "provider"
  },
  {
    "id": "BriaAI",
    "name": "BRIA AI",
    "category": "provider"
  },
  {
    "id": "Browserless",
    "name": "Browserless",
    "category": "provider"
  },
  {
    "id": "BurnCloud",
    "name": "BurnCloud",
    "category": "provider"
  },
  {
    "id": "ByteDance",
    "name": "ByteDance",
    "category": "provider"
  },
  {
    "id": "CentML",
    "name": "CentML",
    "category": "provider"
  },
  {
    "id": "Cerebras",
    "name": "Cerebras",
    "category": "provider"
  },
  {
    "id": "Chutes",
    "name": "Chutes",
    "category": "provider"
  },
  {
    "id": "Civitai",
    "name": "Civitai",
    "category": "provider"
  },
  {
    "id": "Cloudflare",
    "name": "Cloudflare",
    "category": "provider"
  },
  {
    "id": "Cohere",
    "name": "Cohere",
    "category": "provider"
  },
  {
    "id": "CometAPI",
    "name": "Comet API",
    "category": "provider"
  },
  {
    "id": "Crusoe",
    "name": "Crusoe",
    "category": "provider"
  },
  {
    "id": "Decart",
    "name": "Decart",
    "category": "provider"
  },
  {
    "id": "DeepInfra",
    "name": "DeepInfra",
    "category": "provider"
  },
  {
    "id": "DeepMind",
    "name": "DeepMind (Google)",
    "category": "provider"
  },
  {
    "id": "DigitalOcean",
    "name": "DigitalOcean",
    "category": "provider"
  },
  {
    "id": "Exa",
    "name": "Exa",
    "category": "provider"
  },
  {
    "id": "Fal",
    "name": "Fal",
    "category": "provider"
  },
  {
    "id": "Featherless",
    "name": "Featherless.ai",
    "category": "provider"
  },
  {
    "id": "Fireworks",
    "name": "Fireworks",
    "category": "provider"
  },
  {
    "id": "Friendli",
    "name": "Friendli",
    "category": "provider"
  },
  {
    "id": "GiteeAI",
    "name": "GiteeAI",
    "category": "provider"
  },
  {
    "id": "Github",
    "name": "Github",
    "category": "provider"
  },
  {
    "id": "GmiCloud",
    "name": "GMI Cloud",
    "category": "provider"
  },
  {
    "id": "Google",
    "name": "Google",
    "category": "provider"
  },
  {
    "id": "GoogleCloud",
    "name": "GoogleCloud",
    "category": "provider"
  },
  {
    "id": "Groq",
    "name": "Groq",
    "category": "provider"
  },
  {
    "id": "Higress",
    "name": "Higress",
    "category": "provider"
  },
  {
    "id": "Huawei",
    "name": "Huawei",
    "category": "provider"
  },
  {
    "id": "HuaweiCloud",
    "name": "HuaweiCloud (华为云)",
    "category": "provider"
  },
  {
    "id": "HuggingFace",
    "name": "HuggingFace",
    "category": "provider"
  },
  {
    "id": "Hyperbolic",
    "name": "Hyperbolic",
    "category": "provider"
  },
  {
    "id": "IBM",
    "name": "IBM (Granite)",
    "category": "provider"
  },
  {
    "id": "IFlyTekCloud",
    "name": "IFlyTekCloud (讯飞开放平台)",
    "category": "provider"
  },
  {
    "id": "Inceptron",
    "name": "Inceptron",
    "category": "provider"
  },
  {
    "id": "Inference",
    "name": "Inference",
    "category": "provider"
  },
  {
    "id": "Infermatic",
    "name": "Infermatic",
    "category": "provider"
  },
  {
    "id": "Infinigence",
    "name": "Infinigence (无问芯穹)",
    "category": "provider"
  },
  {
    "id": "InternLM",
    "name": "InternLM",
    "category": "provider"
  },
  {
    "id": "IoNet",
    "name": "io.net",
    "category": "provider"
  },
  {
    "id": "Jina",
    "name": "Jina AI",
    "category": "provider"
  },
  {
    "id": "Kagi",
    "name": "Kagi",
    "category": "provider"
  },
  {
    "id": "Kluster",
    "name": "Kluster",
    "category": "provider"
  },
  {
    "id": "Lambda",
    "name": "Lambda",
    "category": "provider"
  },
  {
    "id": "LeptonAI",
    "name": "LeptonAI",
    "category": "provider"
  },
  {
    "id": "LG",
    "name": "LG AI (KMMLU/EXAONE)",
    "category": "provider"
  },
  {
    "id": "LlmApi",
    "name": "LLM API",
    "category": "provider"
  },
  {
    "id": "LmStudio",
    "name": "LM Studio",
    "category": "provider"
  },
  {
    "id": "LobeHub",
    "name": "LobeHub",
    "category": "provider"
  },
  {
    "id": "Menlo",
    "name": "MENLO (Lucy/Jan-nano)",
    "category": "provider"
  },
  {
    "id": "Meta",
    "name": "Meta",
    "category": "provider"
  },
  {
    "id": "Microsoft",
    "name": "Microsoft",
    "category": "provider"
  },
  {
    "id": "Azure",
    "name": "Microsoft Azure",
    "category": "provider"
  },
  {
    "id": "ModelScope",
    "name": "ModelScope (魔搭)",
    "category": "provider"
  },
  {
    "id": "Moonshot",
    "name": "Moonshot (月之暗面)",
    "category": "provider"
  },
  {
    "id": "Nebius",
    "name": "Nebius",
    "category": "provider"
  },
  {
    "id": "NewAPI",
    "name": "New API",
    "category": "provider"
  },
  {
    "id": "Nextbit",
    "name": "Nextbit",
    "category": "provider"
  },
  {
    "id": "NousResearch",
    "name": "NousResearch (Hermes)",
    "category": "provider"
  },
  {
    "id": "Novita",
    "name": "Novita",
    "category": "provider"
  },
  {
    "id": "NPLCloud",
    "name": "NPLCloud",
    "category": "provider"
  },
  {
    "id": "Nvidia",
    "name": "Nvidia (Nemotron)",
    "category": "provider"
  },
  {
    "id": "Ollama",
    "name": "Ollama",
    "category": "provider"
  },
  {
    "id": "OpenAI",
    "name": "OpenAI (ChatGPT)",
    "category": "provider"
  },
  {
    "id": "OpenRouter",
    "name": "OpenRouter",
    "category": "provider"
  },
  {
    "id": "Parasail",
    "name": "Parasail",
    "category": "provider"
  },
  {
    "id": "Perplexity",
    "name": "Perplexity",
    "category": "provider"
  },
  {
    "id": "Phala",
    "name": "Phala",
    "category": "provider"
  },
  {
    "id": "Pi",
    "name": "Pi Agent",
    "category": "provider"
  },
  {
    "id": "PPIO",
    "name": "PPIO",
    "category": "provider"
  },
  {
    "id": "Qiniu",
    "name": "Qiniu (七牛云)",
    "category": "provider"
  },
  {
    "id": "Replicate",
    "name": "Replicate",
    "category": "provider"
  },
  {
    "id": "SambaNova",
    "name": "SambaNova",
    "category": "provider"
  },
  {
    "id": "Search1API",
    "name": "Search1API",
    "category": "provider"
  },
  {
    "id": "SearchApi",
    "name": "SearchApi",
    "category": "provider"
  },
  {
    "id": "SearXNG",
    "name": "SearXNG",
    "category": "provider"
  },
  {
    "id": "SiliconCloud",
    "name": "SiliconCloud (SiliconFlow)",
    "category": "provider"
  },
  {
    "id": "Snowflake",
    "name": "Snowflake",
    "category": "provider"
  },
  {
    "id": "SophNet",
    "name": "SophNet",
    "category": "provider"
  },
  {
    "id": "SpeedAI",
    "name": "SpeedAI",
    "category": "provider"
  },
  {
    "id": "Stability",
    "name": "Stability (StableDiffusion)",
    "category": "provider"
  },
  {
    "id": "StateCloud",
    "name": "StateCloud (天翼云)",
    "category": "provider"
  },
  {
    "id": "Straico",
    "name": "Straico",
    "category": "provider"
  },
  {
    "id": "StreamLake",
    "name": "StreamLake",
    "category": "provider"
  },
  {
    "id": "SubModel",
    "name": "SubModel",
    "category": "provider"
  },
  {
    "id": "Targon",
    "name": "Targon",
    "category": "provider"
  },
  {
    "id": "TII",
    "name": "Technology Innovation Institute (Falcon)",
    "category": "provider"
  },
  {
    "id": "Tencent",
    "name": "Tencent",
    "category": "provider"
  },
  {
    "id": "TencentCloud",
    "name": "TencentCloud (腾讯云)",
    "category": "provider"
  },
  {
    "id": "Together",
    "name": "together.ai",
    "category": "provider"
  },
  {
    "id": "Unsloth",
    "name": "Unsloth",
    "category": "provider"
  },
  {
    "id": "Upstage",
    "name": "Upstage",
    "category": "provider"
  },
  {
    "id": "Vercel",
    "name": "Vercel",
    "category": "provider"
  },
  {
    "id": "VertexAI",
    "name": "VertexAI (Google)",
    "category": "provider"
  },
  {
    "id": "Vllm",
    "name": "vLLM",
    "category": "provider"
  },
  {
    "id": "Volcengine",
    "name": "Volcengine (火山引擎)",
    "category": "provider"
  },
  {
    "id": "Wafer",
    "name": "Wafer",
    "category": "provider"
  },
  {
    "id": "WaveSpeed",
    "name": "WaveSpeed",
    "category": "provider"
  },
  {
    "id": "WorkersAI",
    "name": "WorkersAI (Cloudflare)",
    "category": "provider"
  },
  {
    "id": "WorldRouter",
    "name": "WorldRouter",
    "category": "provider"
  },
  {
    "id": "XAI",
    "name": "xAI",
    "category": "provider"
  },
  {
    "id": "Xinference",
    "name": "Xinference",
    "category": "provider"
  },
  {
    "id": "Xpay",
    "name": "Xpay",
    "category": "provider"
  },
  {
    "id": "Yandex",
    "name": "Yandex",
    "category": "provider"
  },
  {
    "id": "ZenMux",
    "name": "ZenMux",
    "category": "provider"
  },
  {
    "id": "Zhipu",
    "name": "Zhipu (智谱)",
    "category": "provider"
  }
] as const satisfies readonly LobeCatalogItem[];
export const lobeModelCatalog = [
  {
    "id": "Ace",
    "name": "ACE",
    "category": "model"
  },
  {
    "id": "Ai2",
    "name": "Ai2",
    "category": "model"
  },
  {
    "id": "Ai21",
    "name": "Ai21Labs (Jamba)",
    "category": "model"
  },
  {
    "id": "AionLabs",
    "name": "AionLabs",
    "category": "model"
  },
  {
    "id": "Arcee",
    "name": "Arcee",
    "category": "model"
  },
  {
    "id": "AssemblyAI",
    "name": "AssemblyAI",
    "category": "model"
  },
  {
    "id": "Aya",
    "name": "Aya (Cohere)",
    "category": "model"
  },
  {
    "id": "BAAI",
    "name": "BAAI (智源研究院)",
    "category": "model"
  },
  {
    "id": "Baichuan",
    "name": "Baichuan (百川)",
    "category": "model"
  },
  {
    "id": "BilibiliIndex",
    "name": "Bilibili Index (Index Team)",
    "category": "model"
  },
  {
    "id": "ChatGLM",
    "name": "ChatGLM (智谱)",
    "category": "model"
  },
  {
    "id": "Claude",
    "name": "Claude",
    "category": "model"
  },
  {
    "id": "CodeGeeX",
    "name": "CodeGeeX",
    "category": "model"
  },
  {
    "id": "Codex",
    "name": "Codex (OpenAI)",
    "category": "model"
  },
  {
    "id": "CogVideo",
    "name": "CogVideo",
    "category": "model"
  },
  {
    "id": "CogView",
    "name": "CogView",
    "category": "model"
  },
  {
    "id": "CommandA",
    "name": "CommandA (Cohere)",
    "category": "model"
  },
  {
    "id": "Dalle",
    "name": "DALL·E (OpenAI)",
    "category": "model"
  },
  {
    "id": "Dbrx",
    "name": "DBRX (Databricks)",
    "category": "model"
  },
  {
    "id": "DeepCogito",
    "name": "Deep Cogito",
    "category": "model"
  },
  {
    "id": "DeepSeek",
    "name": "DeepSeek",
    "category": "model"
  },
  {
    "id": "Dolphin",
    "name": "Dolphin (dphnAI)",
    "category": "model"
  },
  {
    "id": "DotsStudio",
    "name": "Dots Studio",
    "category": "model"
  },
  {
    "id": "Doubao",
    "name": "Doubao (豆包)",
    "category": "model"
  },
  {
    "id": "ElevenLabs",
    "name": "ElevenLabs",
    "category": "model"
  },
  {
    "id": "EssentialAI",
    "name": "Essential AI",
    "category": "model"
  },
  {
    "id": "FishAudio",
    "name": "FishAudio (Bert)",
    "category": "model"
  },
  {
    "id": "Flux",
    "name": "Flux (black forest labs)",
    "category": "model"
  },
  {
    "id": "Gemini",
    "name": "Gemini (Google)",
    "category": "model"
  },
  {
    "id": "Gemma",
    "name": "Gemma (Google)",
    "category": "model"
  },
  {
    "id": "GLMV",
    "name": "GLM-V",
    "category": "model"
  },
  {
    "id": "Grok",
    "name": "Grok (xAI)",
    "category": "model"
  },
  {
    "id": "HappyHorse",
    "name": "HappyHorse",
    "category": "model"
  },
  {
    "id": "Hunyuan",
    "name": "Hunyuan (腾讯混元)",
    "category": "model"
  },
  {
    "id": "Inception",
    "name": "Inception Labs",
    "category": "model"
  },
  {
    "id": "Inflection",
    "name": "Inflection",
    "category": "model"
  },
  {
    "id": "Kolors",
    "name": "Kolors (快手可图)",
    "category": "model"
  },
  {
    "id": "KwaiKAT",
    "name": "KwaiKAT (KAT-Coder)",
    "category": "model"
  },
  {
    "id": "Kwaipilot",
    "name": "Kwaipilot",
    "category": "model"
  },
  {
    "id": "Liquid",
    "name": "Liquid",
    "category": "model"
  },
  {
    "id": "LLaVA",
    "name": "LLaVA",
    "category": "model"
  },
  {
    "id": "LongCat",
    "name": "LongCat",
    "category": "model"
  },
  {
    "id": "Magic",
    "name": "Magic",
    "category": "model"
  },
  {
    "id": "Meshy",
    "name": "Meshy",
    "category": "model"
  },
  {
    "id": "Minimax",
    "name": "Minimax",
    "category": "model"
  },
  {
    "id": "Mistral",
    "name": "Mistral",
    "category": "model"
  },
  {
    "id": "Morph",
    "name": "Morph",
    "category": "model"
  },
  {
    "id": "NanoBanana",
    "name": "Nano Banana (Google)",
    "category": "model"
  },
  {
    "id": "Nova",
    "name": "Nova (AWS)",
    "category": "model"
  },
  {
    "id": "OpenChat",
    "name": "OpenChat",
    "category": "model"
  },
  {
    "id": "PaLM",
    "name": "PaLM (Google)",
    "category": "model"
  },
  {
    "id": "Perceptron",
    "name": "Perceptron",
    "category": "model"
  },
  {
    "id": "Phind",
    "name": "Phind",
    "category": "model"
  },
  {
    "id": "Poolside",
    "name": "Poolside",
    "category": "model"
  },
  {
    "id": "PrunaAI",
    "name": "Pruna AI",
    "category": "model"
  },
  {
    "id": "Qwen",
    "name": "Qwen (千问)",
    "category": "model"
  },
  {
    "id": "Reka",
    "name": "Reka",
    "category": "model"
  },
  {
    "id": "Relace",
    "name": "Relace",
    "category": "model"
  },
  {
    "id": "Reve",
    "name": "Reve",
    "category": "model"
  },
  {
    "id": "Rwkv",
    "name": "RWKV",
    "category": "model"
  },
  {
    "id": "Sakana",
    "name": "Sakana",
    "category": "model"
  },
  {
    "id": "SenseNova",
    "name": "SenseNova (商汤)",
    "category": "model"
  },
  {
    "id": "Skywork",
    "name": "Skywork (天工)",
    "category": "model"
  },
  {
    "id": "Sora",
    "name": "Sora (OpenAI)",
    "category": "model"
  },
  {
    "id": "Spark",
    "name": "Spark (讯飞星火)",
    "category": "model"
  },
  {
    "id": "Stepfun",
    "name": "Stepfun (阶跃星辰)",
    "category": "model"
  },
  {
    "id": "UnionAlpha",
    "name": "Union Alpha",
    "category": "model"
  },
  {
    "id": "Voyage",
    "name": "Voyage",
    "category": "model"
  },
  {
    "id": "Wenxin",
    "name": "Wenxin (文心)",
    "category": "model"
  },
  {
    "id": "XiaomiMiMo",
    "name": "Xiaomi MiMo",
    "category": "model"
  },
  {
    "id": "Xuanyuan",
    "name": "Xuanyuan (度小满轩辕)",
    "category": "model"
  },
  {
    "id": "Yi",
    "name": "Yi (零一万物)",
    "category": "model"
  }
] as const satisfies readonly LobeCatalogItem[];
