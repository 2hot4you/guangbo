import type {ResourceCard} from "@/content";

export function BareMetalResourceCards({resources}: {resources: readonly ResourceCard[]}) {
  return (
    <div className="bare-metal-resources mt-8">
      {resources.map((resource) => (
        <article aria-labelledby={`${resource.id}-title`} className="bare-metal-resource" key={resource.id}>
          <header className="bare-metal-resource__header">
            <div>
              <p className="bare-metal-resource__category">{resource.category}</p>
              <h3 id={`${resource.id}-title`}>{resource.name}</h3>
            </div>
            <p className="bare-metal-resource__meta">{resource.meta}</p>
          </header>

          <div className="bare-metal-resource__specifications">
            {resource.specifications.map((specification) => (
              <dl key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value}</dd>
              </dl>
            ))}
          </div>

          <div className="bare-metal-resource__details">
            <section aria-labelledby={`${resource.id}-pricing`} className="bare-metal-resource__pricing">
              <h4 id={`${resource.id}-pricing`}>参考租赁价格</h4>
              <div>
                {resource.pricing.map((price) => (
                  <p key={price.label}><span>{price.label}</span><strong>{price.value}</strong></p>
                ))}
              </div>
            </section>
            <section aria-labelledby={`${resource.id}-workloads`} className="bare-metal-resource__workloads">
              <h4 id={`${resource.id}-workloads`}>适用任务</h4>
              <p>{resource.workloads}</p>
            </section>
          </div>

          <footer className="bare-metal-resource__footer">
            <p><span>咨询</span>{resource.contacts.join(" / ")}</p>
            <p>{resource.notice}</p>
          </footer>
        </article>
      ))}
    </div>
  );
}
