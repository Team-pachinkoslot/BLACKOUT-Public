import Link from "next/link";
import { getLabNumber } from "@/lib/labs/queries";
import { difficultyLabels, statusLabels, type Lab } from "@/lib/labs/types";
import { LabIcon } from "./lab-icon";

export function LabCard({ lab }: { lab: Lab }) {
  return (
    <article className="lab-card">
      <div className={`lab-art lab-art-${lab.difficulty}`}>
        <span className="lab-number">LAB {getLabNumber(lab.id)}</span>
        <div className="lab-icon"><LabIcon id={lab.id} /></div>
        <span className="art-caption">シナリオ紹介</span>
      </div>
      <div className="lab-card-body">
        <div className="flex flex-wrap items-center gap-2">
          <span className="status-badge">{statusLabels[lab.status]}</span>
          <span className="difficulty">{difficultyLabels[lab.difficulty]}</span>
        </div>
        <h3><Link href={`/labs/${lab.slug}`}>{lab.title}</Link></h3>
        <p className="card-description">{lab.description}</p>

        <div className="progress-label">進行レベル別の演習進捗</div>
        <div className={`level-progress lab-progress-${lab.id}`}>
          {lab.levels.map((level) => (
            <div key={`${lab.id}-${level.difficulty}`} className={`level-progress-row level-progress-${level.difficulty}`}>
              <span className="level-progress-label">{difficultyLabels[level.difficulty]}</span>
              <progress value={0} max={100} aria-label={`${difficultyLabels[level.difficulty]}の演習進捗: 0%`} />
              <span className="level-progress-percent">0%</span>
            </div>
          ))}
        </div>

        <div className="card-bottom">
          <span>学習時間 {lab.estimatedMinutes}分（仮）</span>
          <Link className="text-link" href={`/labs/${lab.slug}`} aria-label={`${lab.title}の詳細を見る`}>詳細を見る <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </article>
  );
}
