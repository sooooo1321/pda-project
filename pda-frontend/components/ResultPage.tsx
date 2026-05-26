"use client";

import { useEffect, useState } from "react";
import StepNav from "@/components/StepNav";

type RecommendDetail = {
    price_fit: number;
    purpose_fit: number;
    need_fit?: number;
    timing_fit?: number;
    regret_risk?: number;
    dpti_match: number;
};

type RecommendResult = {
    result: string;
    final_score: number;
    detail: RecommendDetail;
    reason_text: string;
    product_id?: number;
    recommendation_id?: number;
};

type ResultPageProps = {
    onPrev: () => void;
    onRestart: () => void;
};

export default function ResultPage({ onPrev, onRestart }: ResultPageProps) {
    const [result, setResult] = useState<RecommendResult | null>(null);
    const [productName, setProductName] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("recommend_result");
        const productInput = localStorage.getItem("product_input");

        if (saved) {
            setResult(JSON.parse(saved));
        }

        if (productInput) {
            const parsed = JSON.parse(productInput);
            setProductName(parsed.product_name || "");
        }
        }, []);

        if (!result) {
        return (
            <div className="page active">
            <div className="section-container">
                <p>추천 결과가 없습니다.</p>
            </div>
            </div>
        );
        }

        const verdictClass =
        result.result === "구매 추천"
            ? "recommend"
            : result.result === "구매 보류"
            ? "hold"
            : "no";

        return (
        <div className="page active">
            <StepNav currentStep={5} />
            <div className="section-container">
            <div className="section-header">
                <div className="section-eyebrow">RECOMMENDATION</div>
                <h2>구매 추천 결과</h2>
                <p>{productName ? `${productName} 분석 결과입니다.` : "분석 결과"}</p>
            </div>

            <div className={`result-verdict ${verdictClass}`}>
                <div className="verdict-score">{Math.round(result.final_score)}</div>
                <div className="verdict-label">{result.result}</div>
                <div className="verdict-text">{result.reason_text}</div>
            </div>

            <div className="score-breakdown">
                <div className="score-card">
                <div className="score-card-label">PRICE FIT</div>
                <div className="score-card-value">{Math.round(result.detail.price_fit)}</div>
                </div>

                <div className="score-card">
                <div className="score-card-label">PURPOSE FIT</div>
                <div className="score-card-value">{Math.round(result.detail.purpose_fit)}</div>
                </div>

                <div className="score-card">
                <div className="score-card-label">DPTI MATCH</div>
                <div className="score-card-value">{Math.round(result.detail.dpti_match)}</div>
                </div>
            </div>

            <div className="analysis-block">
                <h4>DPTI MATCH 세부 분석</h4>
                <p>
                Need Fit: {result.detail.need_fit ?? "-"} / Timing Fit:{" "}
                {result.detail.timing_fit ?? "-"} / Regret Risk:{" "}
                {result.detail.regret_risk ?? "-"}
                </p>
            </div>

            <div className="analysis-block">
                <h4>AI 코칭 메시지</h4>
                <p>{result.reason_text}</p>
            </div>

            <div className="page-actions">
                <button className="btn-secondary" onClick={onPrev}>
                    ← 다시 입력
                </button>
                <button 
                    className="btn-primary" 
                    onClick={() => {
                        localStorage.removeItem("recommend_result");
                        localStorage.removeItem("product_input");
                        onRestart();
                    }}
                >
                    새 상품 분석 +
                </button>
            </div>
            </div>
        </div>
    );
}