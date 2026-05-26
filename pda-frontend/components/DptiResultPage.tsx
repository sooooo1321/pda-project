"use client";

import { DPTI_TYPE_INFO } from "@/constants/dptiType";

import { useEffect, useState } from "react";
import StepNav from "@/components/StepNav";

type DptiScores = {
    Impulse: number;
    Calculation: number;
    Target: number;
    Emotional: number;
};

type DptiResult = {
    dpti_type: string;
    scores: DptiScores;
};

type DptiResultPageProps = {
    onPrev: () => void;
    onNext: () => void;
};

export default function DptiResultPage({ onPrev, onNext }: DptiResultPageProps) {
    const [result, setResult] = useState<DptiResult | null>(null);

    type DptiType = "Impulse" | "Calculation" | "Target" | "Emotional";

    type DptiResult = {
        dpti_type: DptiType;
        scores: DptiScores;
    };

    useEffect(() => {
        const saved = localStorage.getItem("dpti_result");
        if (saved) {
            setResult(JSON.parse(saved));
        }
    }, []);

    if (!result) {
        return (
            <div className="page active">
                <div className="section-container">
                    <p>분석 결과가 없습니다.</p>
                </div>
            </div>
        );
    }

    const info = DPTI_TYPE_INFO[result.dpti_type];

    return (
        <div className="page active">
            <StepNav currentStep={2} />
            <div className="section-container">
                <div className="section-header">
                    <div className="section-eyebrow">DPTI RESULT</div>
                    <h2>성향 분석 결과</h2>
                </div>

                <div className="dpti-result-hero">
                    <div className="dpti-type-badge">
                        <span>{info.badge}</span>
                    </div>
                    <h2>{info.name}</h2>
                    <p>{info.desc}</p>
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-title">SCORE BY TYPE</div>
                        <div className="bar-rows">
                            <div className="bar-row">
                                <div className="bar-label">IMPULSE</div>
                                <div className="bar-track">
                                    <div className="bar-fill impulse" style={{ width: `${result.scores.Impulse * 4}%` }}></div>
                                </div>
                                <div className="bar-score">{result.scores.Impulse}</div>
                            </div>

                            <div className="bar-row">
                                <div className="bar-label">CALCUL.</div>
                                <div className="bar-track">
                                    <div className="bar-fill calculation" style={{ width: `${result.scores.Calculation * 4}%` }}></div>
                                </div>
                                <div className="bar-score">{result.scores.Calculation}</div>
                            </div>

                            <div className="bar-row">
                                <div className="bar-label">TARGET</div>
                                <div className="bar-track">
                                    <div className="bar-fill target" style={{ width: `${result.scores.Target * 4}%` }}></div>
                                </div>
                                <div className="bar-score">{result.scores.Target}</div>
                            </div>

                            <div className="bar-row">
                                <div className="bar-label">EMOTIO.</div>
                                <div className="bar-track">
                                    <div className="bar-fill emotional" style={{ width: `${result.scores.Emotional * 4}%` }}></div>
                                </div>
                                <div className="bar-score">{result.scores.Emotional}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-actions">
                    <button 
                        className="btn-secondary" 
                        onClick={() => {
                            localStorage.removeItem("dpti_result");
                            localStorage.removeItem("financial_info");
                            localStorage.removeItem("recommend_result");
                            localStorage.removeItem("product_input");
                            onPrev();
                        }}
                    >
                        ← 다시 설문
                    </button>
                    <button className="btn-primary" onClick={onNext}>
                        재정 정보 입력 →
                    </button>
                </div>
            </div>
        </div>
    );
}