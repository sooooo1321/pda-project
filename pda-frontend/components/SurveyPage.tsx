"use client";

import { submitDpti  } from "@/lib/api";
import { QUESTIONS, OPTION_LABELS } from "@/constants/dpti";

import { useMemo, useState } from "react";
import StepNav from "@/components/StepNav";

const API_BASE_URL = "http://127.0.0.1:8000";



type Answers = Record<number, number>;

type SurveyPageProps = {
    onSuccess: () => void;
};

export default function SurveyPage({ onSuccess }: SurveyPageProps) {
    const [answers, setAnswers] = useState<Answers>({});
    const [loading, setLoading] = useState(false);

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const pickAnswer = (questionIndex: number, value: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: value,
        }));
    };

    const submitSurvey = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
            return;
        }

        if (answeredCount !== 20) {
            alert("20문항 모두 응답해 주세요.");
            return;
        }

        const impulse = [0, 1, 2, 3, 4].map((i) => answers[i]);
        const calculation = [5, 6, 7, 8, 9].map((i) => answers[i]);
        const target = [10, 11, 12, 13, 14].map((i) => answers[i]);
        const emotional = [15, 16, 17, 18, 19].map((i) => answers[i]);

        try {
            setLoading(true);

            const data = await submitDpti(userId, {
                impulse,
                calculation,
                target,
                emotional,
            });

            localStorage.setItem("dpti_result", JSON.stringify(data));
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page active">
            <StepNav currentStep={1} />
            <div className="section-container">
                <div className="section-header">
                    <div className="section-eyebrow">DPTI SURVEY</div>
                    <h2>의사결정 성향 분석</h2>
                    <p>총 20문항에 응답하면 DPTI 유형을 분석합니다.</p>
                </div>

                <div className="prog-bar-wrap">
                    <div className="prog-meta">
                        <span className="prog-cat">PROGRESS</span>
                        <span className="prog-count">
                            {answeredCount} / 20
                        </span>
                    </div>
                    <div className="prog-track">
                        <div
                            className="prog-fill"
                            style={{ width: `${(answeredCount / 20) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div id="q-wrap">
                    {QUESTIONS.map((question, index) => (
                        <div className="survey-card" key={index}>
                            <div className="survey-q">
                                <span className="q-num">Q{String(index + 1).padStart(2, "0")}</span>
                                <span>{question}</span>
                            </div>

                            <div className="survey-opts">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`opt-btn ${answers[index] === value ? "selected" : ""}`}
                                        onClick={() => pickAnswer(index, value)}
                                    >
                                        <span className="opt-num">{value}</span>
                                        <span className="opt-lbl">{OPTION_LABELS[value - 1]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="page-actions">
                    <button className="btn-primary" onClick={submitSurvey} disabled={loading}>
                        {loading ? "분석 중..." : "DPTI 결과 보기 →"}
                    </button>
                </div>
            </div>
        </div>
    );
}