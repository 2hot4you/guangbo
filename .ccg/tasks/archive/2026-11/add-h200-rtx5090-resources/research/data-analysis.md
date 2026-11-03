# Resource data and copy analysis

## Scope and evidence

Read-only analysis of the task requirements, existing resource data/types, both renderers, component tests, frontend spec, and content tests. No product source files changed. The original H200 image is not available in this agent's context or the task directory; image-specific transcription is therefore checked against `requirements.md:7–21`, not independently against image pixels. The lead agent subsequently confirmed it directly checked the original image and the requirement transcription is accurate. Official product references below validate component identity, not the supplied vendor inventory, pricing, maintenance, or delivery commitments.

## Files found

- `src/content/resources/bare-metal.ts:3` — single resource array; append H200 and RTX 5090 after the preserved DeepBlue entry.
- `src/content/types.ts:30` — `ResourceCard` already represents identity, summary, arbitrary specification rows, multiple prices, use cases, contacts, and notice.
- `src/content/pages/idc.ts:89` — detail page receives the resource array directly as `resourceCards`.
- `src/components/marketing/bare-metal-resource-cards.tsx:3` — detail renderer maps all resources to independently named articles.
- `src/components/marketing/home-page.tsx:12,58,160` — home renderer filters specification labels and renders only array index 0.
- `tests/components/marketing-page.test.tsx:199,240,270` — detail single-card regression, isolation fixture, and home summary coverage.
- `tests/content/pages.test.ts:42` — serialized content must contain exactly the two existing DeepBlue phone occurrences.
- `.ccg/spec/frontend/index.md:14` — stop persistent development before production verification to avoid generated `.next` conflicts.

## Dependencies

`bareMetalResources` → `idc.ts` resource section → `MarketingPageView` detail template → `BareMetalResourceCards`.

`bareMetalResources` → `HomePage` → `HomeFeaturedResource` → filtered specification rows + prices + notice + internal details link.

Both views should read the same objects. Existing `ResourceCard` is sufficient; a new inventory/catalogue schema is unnecessary for this task. Keep stable unique IDs and unique specification/price labels because renderers use these as React keys.

## Findings by severity

### Critical

No confirmed critical defect in the current data structure. Incorrectly publishing RTX 4090 with a standard 32GB configuration would be a material content error; use the agreed RTX 5090 interpretation consistently on both pages.

### Warning

1. **Home is currently index-0 only.** Appending data alone will populate the detail route but omit both products from home (`home-page.tsx:160`). Map the array with a stable ID key, preserving DeepBlue first.
2. **Missing contact data must stay missing.** Use `contacts: []` for both new resources. Both current renderers unconditionally output “咨询” (`bare-metal-resource-cards.tsx:41`, `home-page.tsx:86`); conditionally render the contact paragraph when the array has entries. Do not copy DeepBlue's phone numbers. Doing so also breaks the precise contact-content test.
3. **CPU core counts are per processor.** H200 should read “Intel Xeon Platinum 8558 × 2（单颗 48 核 96 线程、2.1 GHz）”. Do not imply the dual-CPU server has only 48 cores.
4. **DDR5-5600 is the supplied module specification, not a verified operating speed.** Intel lists DDR5 at 5200 MT/s for the 8558 at 1 DPC. Preserve the supplied module rating but qualify actual operating rate as platform-dependent; do not promise 5600 MT/s operation with 32 DIMMs.
5. **H200 region was not supplied.** The southwest region applies only to the RTX 5090 node. Use “部署区域按项目确认” for H200 if a region row is necessary. Do not borrow RTX region or one-month delivery for H200.
6. **Cooperation term and maintenance term differ.** H200 is five-year cooperation, with three-year 7×24 on-site maintenance. Preserve both separately; do not call the five-year term a warranty, or imply five years of included maintenance.
7. **Price units differ in the supplied source.** H200 explicitly states per server per month; RTX gives monthly starting prices for a node offering. Preserve “最低/起” and the two inclusion conditions. Do not add an unsupported claim that H200 includes the same electricity/network scope.
8. **Keep supplied system specifications distinct from reference systems.** Storage interface, management NIC, chassis details, and PSU counts rely on the task transcription, confirmed against the image by the lead agent. Do not substitute DGX H200 reference system specifications: this offer has different CPUs, NIC speeds, and storage.

### Info

- NVIDIA's standard product comparison supports RTX 5090 32GB versus RTX 4090 24GB. This makes 5090 the internally consistent interpretation of the provided “8×32G” + “128台5090”; it remains an interpretation of conflicting source copy rather than proof of a vendor's actual shipment.
- NVIDIA's HGX reference table explicitly supports H200 SXM with 141GB HBM3e per GPU. Eight such GPUs equal 1128GB total, but a total is not required and should not imply one automatically pooled allocation.
- Keep `workloads` cautious (“可评估用于…；实际适配与性能以测试为准”), following `bare-metal.ts:22`. Avoid invented throughput, model-size, NVLink, performance, or software guarantees for RTX nodes.
- A `summary` exists but detail cards currently do not render it (`bare-metal-resource-cards.tsx:10–23`). All required facts should live in visible specification rows or prices, even if also mentioned in summaries/meta.
- Links can remain `/idc/bare-metal`, matching `PublicPath` and the existing approved-link tests. Product-anchor links are optional and would require deliberate fragment handling/type/test changes; this task does not need them.

## Recommended field values

### H200

- `id`: `h200-cluster-node`
- `name`: `H200 集群节点`
- `category`: `GPU 裸金属`
- `meta`: `128 台资源｜IB 组网｜风冷散热`
- `summary`: `8 卡 H200 SXM 141GB 集群节点，配置双路 Intel Xeon Platinum 8558、2TB 内存与 IB 组网，128 台资源，五年合作周期，可议价。`
- `contacts`: `[]`
- `pricing`: one row, label `整机租赁`, value `参考价 ¥170,000/台/月，可议价`.
- `notice`: `库存、价格、地域、网络、交付和合作条件以实际确认为准。`

Suggested detail `specifications`:

| label | value |
| --- | --- |
| 处理器 | Intel Xeon Platinum 8558 × 2（单颗 48 核 96 线程、2.1 GHz） |
| GPU | NVIDIA H200 SXM 141GB HBM3e × 8 |
| 内存 | 2TB（64GB × 32，DDR5-5600 ECC RDIMM；实际运行速率以平台配置为准） |
| 系统盘 | 960GB U.2 NVMe PCIe 5.0 企业级 SSD × 1 |
| 高速数据盘 | 3.84TB U.2 NVMe PCIe 5.0 企业级 SSD × 2 |
| 网络 | IB 组网；NVIDIA ConnectX-7 200Gb/s × 8，支持 GPUDirect RDMA |
| 管理网络 | NVIDIA ConnectX-6 100Gb/s × 1 |
| 电源 | 3000W 钛金高效冗余电源模块 × 6 |
| 机箱与散热 | 8U 机架式 AI 超算机箱，风冷；定制加固支撑、背部整列风扇墙多机组散热、设备导轨、免工具维护 |
| 资源规模 | 128 台 |
| 部署区域 | 按项目确认 |
| 合作周期 | 五年合作周期 |
| 配套维护 | 3 年 7×24 小时上门维护，含硬件响应、系统调优与驱动升级 |

### RTX 5090

- `id`: `rtx5090-eight-gpu-node`
- `name`: `8 卡 RTX 5090 裸金属节点`
- `category`: `GPU 裸金属`
- `meta`: `西南区域｜128 台资源｜约 1 个月交付`
- `summary`: `8 卡 RTX 5090 32GB 涡轮节点，配置双路 Intel Xeon Gold 6530、512GB DDR5 与 25Gb 双口网卡，西南区域 128 台资源，交付周期约 1 个月。`
- `contacts`: `[]`
- `notice`: same confirmation wording as H200.

Suggested detail `specifications`:

| label | value |
| --- | --- |
| 处理器 | Intel Xeon Gold 6530 × 2 |
| GPU | RTX 5090 32GB 涡轮卡 × 8 |
| 内存 | DDR5 512GB（64GB × 8） |
| 存储 | 960GB × 1；3.84TB × 1 |
| 网络 | 25Gb 双口网卡 |
| 电源 | 2500W × 4 |
| 资源规模 | 128 台 |
| 部署区域 | 西南区域 |
| 交付周期 | 约 1 个月 |

Suggested `pricing`:

| label | value |
| --- | --- |
| 含机房、含电、含网 | 最低 ¥16,500/月 |
| 客户自备机房和组网 | 最低 ¥13,500/月 |

Do not invent NVMe/PCIe specifications, PSU redundancy or efficiency, or memory rate for RTX: these were not supplied.

## Home summary pattern

Lowest-scope approach: extend `featuredSpecificationLabels` with `网络` and `资源规模`, use the same source rows, and map all three resources. H200's “管理网络”, storage detail, chassis, supply modules, and maintenance remain on detail. The H200 summary can carry its cooperation term; the RTX summary can carry region/delivery. Existing DeepBlue home behavior still hides its network because its old test explicitly asserts “1GbE 电口” is absent; accommodate that regression deliberately (for example per-resource summary label selection or an optional `featuredSpecifications` field), rather than blindly adding `网络` globally.

If a shared global filter would make home verbose, an optional `featuredSpecifications` array on `ResourceCard` is a reasonable small extension. It should only override concise rows; all prices, identity, notice, and contact data remain shared. Prefer keeping the model unchanged unless the implementation needs genuinely different home wording. Do not duplicate complete product objects for home and detail.

## Recommended tests

1. Update the detail assertion from one to three articles, then select each with `getByRole('article', {name: ...})`; keep all existing DeepBlue assertions scoped to its article.
2. H200 detail asserts both CPUs and “单颗”, 8 H200 SXM, 141GB HBM3e, 32×64GB/2TB, both separate disk rows, 8×200Gb/s compute NICs, 100Gb/s management NIC, 6×3000W, 8U/风冷, 128台, five-year cooperation, and three-year 7×24 maintenance.
3. RTX detail asserts Gold 6530×2, 5090 32GB×8, 512GB DDR5, both disks, 25Gb双口, 4×2500W, 西南, 128台, 约1个月, and both condition-specific starting prices.
4. Assert RTX article has no `4090`, `H200`, or DeepBlue phones; H200 article has no `RTX 5090`, `西南区域`, or `约 1 个月`; DeepBlue has no new-product prices/configurations.
5. New cards render the actual confirmation notice and do not render an empty “咨询” paragraph. Preserve both existing DeepBlue phone numbers and the exact content-level contact test.
6. Home `#idc` contains three independently named articles, each with the correct GPU, CPU, memory, network (new products), resource quantity (new products), price conditions, and uniquely named details link to `/idc/bare-metal`.
7. Home should omit H200's detailed chassis/maintenance/management NIC and preserve the existing DeepBlue exclusions; detail should retain all these H200 details.
8. Static server HTML on both routes contains all three product names, each relevant price, and notices; no `4090` or internal SKU leak.
9. Content-level tests should verify detail's `available-resource.resourceCards` references the shared resources and IDs are unique. Avoid brittle assertions against every punctuation/space choice when numeric/semantic content is sufficient.
10. Visual/E2E owner should check narrow 320/375px and desktop widths for horizontal overflow with H200's longest specification; jsdom component tests cannot establish rendered layout width.

## Official references

- [Intel Xeon Platinum 8558 specifications](https://www.intel.com/content/www/us/en/products/sku/237255/intel-xeon-platinum-8558-processor-260m-cache-2-10-ghz/specifications.html) — 48 cores, 96 threads, 2.1GHz base; DDR5 5200MT/s at 1DPC.
- [NVIDIA HGX components](https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory-h100-h200-b200/latest/components.html) — H200 SXM, 141GB HBM3e per GPU, eight GPUs per node.
- [NVIDIA RTX 5090 product comparison](https://www.nvidia.com/en-gb/geforce/graphics-cards/50-series/rtx-5090/) — standard RTX 5090 32GB; comparison with RTX 4090 24GB.
- [NVIDIA Ada architecture whitepaper](https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf) — RTX 4090 full specifications, 24GB GDDR6X.

Research only: no tests run because no source implementation was changed.
