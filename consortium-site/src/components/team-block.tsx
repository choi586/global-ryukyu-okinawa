import { ConfettiName } from '@/components/confetti-name';
import type { Content } from '@/content/types';
import { asset } from '@/lib/base-path';

// Lead researcher beside the team lists. `teaser` adds a line from the
// director's greeting and a link to the people page, where it is read in full.
export function TeamBlock({ c, teaser = false }: { c: Content; teaser?: boolean }) {
  const { people } = c;
  const { greeting } = people;
  return (
    <div className="cs-team cs-reveal">
      <div className="cs-team-lead">
        {/* On the people page the portrait already sits beside the greeting. */}
        {teaser && greeting ? (
          <img
            className="cs-team-photo"
            src={asset('/images/consortium/people/son-jiyeon.jpg')}
            width={178}
            height={216}
            alt={greeting.photoAlt}
            loading="lazy"
          />
        ) : null}
        <p className="cs-card-type">{people.leadRole}</p>
        <h3>{people.leadName}</h3>
        <p className="cs-team-lead-lines">
          {people.leadLines[0]}
          <br />
          {people.leadLines[1]}
        </p>
        {teaser && greeting ? (
          <div className="cs-team-greeting">
            <p>{greeting.teaser}</p>
            <a href={asset('/people/')}>
              {greeting.readMore} <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : null}
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
        {(
          [
            [people.staffLabel, people.staff],
            [people.studentsLabel, people.students],
          ] as const
        ).map(([label, members]) => (
          <div key={label} className="cs-team-list cs-team-staff">
            <p className="cs-card-type">{label}</p>
            <ul>
              {members.map((person) => (
                <li key={person.name}>
                  {person.confetti ? (
                    <ConfettiName name={person.name} />
                  ) : (
                    <strong>{person.name}</strong>
                  )}
                  <span>{person.place}</span>
                  {person.field ? <span>{person.field}</span> : null}
                  {person.bio?.length ? (
                    <details className="cs-team-bio">
                      <summary>{people.bioToggle}</summary>
                      {person.bio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
