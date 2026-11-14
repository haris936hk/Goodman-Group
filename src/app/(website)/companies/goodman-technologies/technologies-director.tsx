import Image from "next/image";
import { ArrowUpRight, Boxes, Code2, Database, Sparkles } from "lucide-react";

import { goodmanTechnologiesProfile } from "@/data/goodman-technologies";
import { TechnologiesDirectorOrbit } from "./technologies-director-orbit";
import "./technologies-director.css";

const expertiseIcons = [Code2, Sparkles, Database, Boxes];

export function TechnologiesDirector() {
  const director = goodmanTechnologiesProfile.director;

  return (
    <section className="technologies-section technologies-director" id="director" aria-labelledby="director-heading">
      <div className="technologies-shell">
        <div className="technologies-heading technologies-director-heading" data-technologies-reveal>
          <p className="technologies-eyebrow">05 / The director</p>
          <h2 id="director-heading">Technical perspective.<br /><span>Grounded in engineering.</span></h2>
          <p>The expertise behind Goodman Technologies.</p>
        </div>
        <TechnologiesDirectorOrbit>
          <div className="technologies-director-rings" aria-hidden="true">
            {[0, 1, 2].map((ring) => (
              <span className="technologies-director-ring" key={ring}>
                <span className="technologies-director-track"><span /></span>
              </span>
            ))}
          </div>
          <figure className="technologies-director-profile">
            <div className="technologies-director-portrait-frame">
              <div className="technologies-director-portrait">
                <Image
                  src={director.portrait.src}
                  width={director.portrait.width}
                  height={director.portrait.height}
                  sizes="(max-width: 640px) 80vw, 330px"
                  alt={`${director.name}, ${director.role}`}
                />
              </div>
              <p className="technologies-director-role">{director.role}</p>
            </div>
            <figcaption className="technologies-director-identity">
              <h3>{director.name}<span aria-hidden="true">.</span></h3>
              <p>{director.profession}</p>
              <div className="technologies-director-links">
                <a href={director.portfolio}>Explore his portfolio <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a href={director.linkedIn}>LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </figcaption>
          </figure>
          <ul className="technologies-director-expertise" aria-label={`${director.name}’s expertise`}>
            {director.expertise.map((expertise, index) => {
              const Icon = expertiseIcons[index];
              return (
                <li key={expertise.id}>
                  <div className="technologies-director-card">
                    <div className="technologies-director-card-top">
                      <span>0{index + 1} / {expertise.category}</span>
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <h3>{expertise.title}</h3>
                    <p className="technologies-director-stack">{expertise.stack}</p>
                    <p>{expertise.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </TechnologiesDirectorOrbit>
      </div>
    </section>
  );
}
