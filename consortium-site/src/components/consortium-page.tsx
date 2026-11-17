import { SiteFooter } from '@/components/site-footer';
import { asset } from '@/lib/base-path';
import type { Content } from '@/content/types';
import { FilmPlayer } from '@/components/film-player';

const img = (name: string) => asset(`/images/consortium/${name}`);

function SectionHead({
  no,
  label,
  title,
  lead,
}: {
  no: string;
  label: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <div className="cs-head cs-reveal">
      <p className="cs-label">
        <span>{no}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {lead ? <p className="cs-head-lead">{lead}</p> : null}
    </div>
  );
}

export function ConsortiumPage({ c }: { c: Content }) {
  const { about, research, band, programs, archive, people } = c;
  return (
    <>
      {/* 1. Hero: East Asia map */}
      <section className="cs-hero" id="top" aria-labelledby="cs-hero-title">
        <div className="cs-hero-map" aria-hidden="true">
          <div className="cs-hero-stage">
            <div className="cs-hero-drift">
              <img
                className="cs-hero-photo"
                src={img('hero-deep-sea.webp')}
                width={2048}
                height={1152}
                alt=""
                fetchPriority="high"
              />
              <svg className="cs-hero-lines" viewBox="0 0 2048 1152" preserveAspectRatio="none">
                <g className="cs-hero-gaps">
                  <path pathLength={1} d="M1396 398 Q1432 552 1323 687" />
                  <path pathLength={1} d="M1323 687 Q1130 690 928 812" />
                  <path pathLength={1} d="M928 812 Q1080 520 1396 398" />
                </g>
                <path
                  className="cs-hero-glow cs-hero-l1"
                  pathLength={1}
                  d="M1396 398 Q1432 552 1323 687"
                />
                <path
                  className="cs-hero-glow cs-hero-l2"
                  pathLength={1}
                  d="M1323 687 Q1130 690 928 812"
                />
                <path
                  className="cs-hero-glow cs-hero-l3"
                  pathLength={1}
                  d="M928 812 Q1080 520 1396 398"
                />
                <path
                  className="cs-hero-line cs-hero-l1"
                  pathLength={1}
                  d="M1396 398 Q1432 552 1323 687"
                />
                <path
                  className="cs-hero-line cs-hero-l2"
                  pathLength={1}
                  d="M1323 687 Q1130 690 928 812"
                />
                <path
                  className="cs-hero-line cs-hero-l3"
                  pathLength={1}
                  d="M928 812 Q1080 520 1396 398"
                />
                <path
                  className="cs-hero-comet"
                  pathLength={1}
                  d="M1396 398 Q1432 552 1323 687 Q1130 690 928 812 Q1080 520 1396 398"
                />
                <circle className="cs-hero-ring cs-hero-p1" cx="1396" cy="398" r="26" />
                <circle className="cs-hero-ring cs-hero-p2" cx="1323" cy="687" r="26" />
                <circle className="cs-hero-ring cs-hero-p3" cx="928" cy="812" r="26" />
                <circle className="cs-hero-dot cs-hero-p1" cx="1396" cy="398" r="5" />
                <circle className="cs-hero-dot cs-hero-p2" cx="1323" cy="687" r="5" />
                <circle className="cs-hero-dot cs-hero-p3" cx="928" cy="812" r="5" />
              </svg>
            </div>
          </div>
        </div>
        <div className="cs-shell cs-hero-body">
          <p className="cs-hero-keys" aria-label={c.hero.keysAria}>
            {c.hero.keys.map((key) => (
              <span key={key}>{key}</span>
            ))}
          </p>
          <h1 id="cs-hero-title">
            {c.hero.lines.map((line) => (
              <span key={line} className="cs-hero-mask">
                <span>{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <a className="cs-scroll" href="#about" aria-label={c.ui.scrollAria}>
          <span />
          SCROLL
        </a>
      </section>

      {/* 2. Statement */}
      <section className="cs-section cs-statement" id="about" aria-labelledby="cs-statement-title">
        <div className="cs-shell">
          <p className="cs-label cs-reveal">
            <span>{about.no}</span>
            {about.label}
          </p>
          <h2 className="cs-statement-text cs-reveal" id="cs-statement-title">
            {about.statement[0]}
            <br />
            {about.statement[1]}
          </h2>
          <p className="cs-intro-line">{about.intro}</p>
          <details className="cs-details">
            <summary>{about.factsToggle}</summary>
            <dl className="cs-facts">
              {about.facts.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </details>
          <ul className="cs-keywords">
            {about.keywords.map((keyword) => (
              <li key={keyword.word} className="cs-reveal">
                <p className="cs-keyword-word">
                  {keyword.word}
                  <span>{keyword.en}</span>
                </p>
                <p>{keyword.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Research */}
      <section className="cs-section cs-research" id="research" aria-labelledby="cs-research-title">
        <div className="cs-shell">
          <SectionHead
            no={research.no}
            label={research.label}
            title={<span id="cs-research-title">{research.title}</span>}
          />
          <ul className="cs-axes">
            {research.axes.map((axis) => (
              <li key={axis.no} className="cs-axis cs-reveal">
                <div className="cs-axis-body">
                  <span className="cs-axis-no" aria-hidden="true">
                    {axis.no}
                  </span>
                  <p className="cs-axis-kind">{axis.kind}</p>
                  <h3>{axis.title}</h3>
                  <p className="cs-axis-places">{axis.places}</p>
                  <p className="cs-axis-text">{axis.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <details className="cs-details">
            <summary>{research.planToggle}</summary>
            <div className="cs-stages">
              {research.stages.map((stage) => (
                <article key={stage.step} className="cs-stage cs-reveal">
                  <div className="cs-stage-body">
                    <p className="cs-stage-step">
                      {stage.step}
                      <span>{stage.tag}</span>
                    </p>
                    <h3>{stage.name}</h3>
                    <p className="cs-stage-question">{stage.question}</p>
                    <ol>
                      {stage.years.map(([year, goal]) => (
                        <li key={year}>
                          <span>{year}</span>
                          {goal}
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              ))}
            </div>

            <div className="cs-method-row">
              <div className="cs-method cs-reveal">
                <h3>{research.methodsTitle}</h3>
                <dl>
                  {research.methods.map(([name, text]) => (
                    <div key={name}>
                      <dt>{name}</dt>
                      <dd>{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="cs-shift cs-reveal">
                <h3>{research.shiftTitle}</h3>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{research.shiftFrom}</th>
                      <th scope="col">{research.shiftTo}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {research.shifts.map(([from, to]) => (
                      <tr key={from}>
                        <td>{from}</td>
                        <td>{to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Island words band */}
      <section className="cs-band" aria-labelledby="cs-band-title">
        <img
          className="cs-band-bg"
          src={img('sea-chain.webp')}
          width={1600}
          height={900}
          alt=""
          loading="lazy"
        />
        <div className="cs-shell cs-band-inner">
          <div className="cs-reveal">
            <p className="cs-label cs-label-light">{band.label}</p>
            <h2 id="cs-band-title">
              {band.title[0]}
              <br />
              {band.title[1]}
            </h2>
            <p className="cs-band-lead">{band.lead}</p>
            <p className="cs-band-steps">
              {band.steps.map((step) => (
                <span key={step}>{step}</span>
              ))}
            </p>
            <p className="cs-band-try">
              <a
                className="cs-button"
                href={band.tryIt.href}
                target="_blank"
                rel="noreferrer"
                aria-label={band.tryIt.aria}
              >
                {band.tryIt.label} <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
          <ul className="cs-words">
            {band.words.map((item) => (
              <li key={item.word} className="cs-reveal">
                <p className="cs-word-place">{item.place}</p>
                <p className="cs-word">
                  {item.word}
                  <span>{item.reading}</span>
                </p>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Programs */}
      <section className="cs-section cs-programs" id="programs" aria-labelledby="cs-programs-title">
        <div className="cs-shell">
          <SectionHead
            no={programs.no}
            label={programs.label}
            title={<span id="cs-programs-title">{programs.title}</span>}
          />
          <div className="cs-program-layout">
            <div className="cs-program-groups">
              {programs.groups.map((group, i) => (
                <section key={group.group} className="cs-program-group cs-reveal">
                  <h3>
                    <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {group.group}
                  </h3>
                  <ul>
                    {group.items.map(([name, text, detail]) =>
                      detail ? (
                        <li key={name} className="cs-program-open">
                          <details>
                            <summary>
                              <strong>{name}</strong>
                              <span>{text}</span>
                            </summary>
                            <div className="cs-program-detail">
                              {detail.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                              ))}
                            </div>
                          </details>
                        </li>
                      ) : (
                        <li key={name}>
                          <strong>{name}</strong>
                          <span>{text}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </section>
              ))}
              <p className="cs-note">{programs.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Archive & outputs */}
      <section className="cs-section cs-archive" id="archive" aria-labelledby="cs-archive-title">
        <div className="cs-shell">
          <SectionHead
            no={archive.no}
            label={archive.label}
            title={<span id="cs-archive-title">{archive.title}</span>}
          />
          <div className="cs-film cs-reveal">
            <FilmPlayer
              src={img('film.mp4')}
              poster={img('film-poster.webp')}
              label={archive.filmAria}
              playLabel={archive.filmPlay}
            />
            <div className="cs-film-copy">
              <p className="cs-card-type">{archive.filmType}</p>
              <h3>{archive.filmTitle}</h3>
            </div>
          </div>
          <ul className="cs-outputs">
            {archive.outputs.map((item) => (
              <li key={item.title} className="cs-output cs-reveal">
                <p className="cs-card-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p className="cs-output-status">{item.status}</p>
              </li>
            ))}
          </ul>
          <div className="cs-news cs-reveal">
            <h3>{archive.newsTitle}</h3>
            <ul>
              {archive.news.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>
                    <span className="cs-news-kind">{item.kind}</span>
                    <span className="cs-news-title">{item.title}</span>
                    {item.date ? <time>{item.date}</time> : <span />}
                    <span className="cs-news-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* People */}
      <section className="cs-section cs-people" id="people" aria-labelledby="cs-people-title">
        <div className="cs-shell">
          <SectionHead
            no={people.no}
            label={people.label}
            title={<span id="cs-people-title">{people.title}</span>}
          />
          <ul className="cs-partners">
            {people.partners.map((partner) => (
              <li key={partner.name} className={'cs-reveal' + (partner.home ? ' is-home' : '')}>
                <p className="cs-partner-role">{partner.role}</p>
                <h3>{partner.name}</h3>
                <p>{partner.text}</p>
              </li>
            ))}
          </ul>
          <div className="cs-team cs-reveal">
            <div className="cs-team-lead">
              <p className="cs-card-type">{people.leadRole}</p>
              <h3>{people.leadName}</h3>
              <p>
                {people.leadLines[0]}
                <br />
                {people.leadLines[1]}
              </p>
            </div>
            <div className="cs-team-lists">
              <div className="cs-team-list">
                <p className="cs-card-type">{people.teamLabel}</p>
                <ul>
                  {people.researchers.map(([name, place, field]) => (
                    <li key={name}>
                      <strong>{name}</strong>
                      <span>{place}</span>
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cs-team-list cs-team-staff">
                <p className="cs-card-type">{people.staffLabel}</p>
                <ul>
                  {people.staff.map(([name, place]) => (
                    <li key={name}>
                      <strong>{name}</strong>
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter c={c} />
    </>
  );
}
