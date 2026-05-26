"use client";

import { saveFinancialInfo } from "@/lib/api";

import { useState } from "react";
import StepNav from "@/components/StepNav";

type FinancePageProps ={
    onPrev: () => void;
    onNext: () => void;
};

export default function FinancePage({ onPrev, onNext }: FinancePageProps) {
    const [capital, setCapital] = useState("");
    const [income, setIncome] = useState("");
    const [fixedExpense, setFixedExpense] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSaveFinancialInfo = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        try {
            setLoading(true);

            const data = await saveFinancialInfo({
                user_id: Number(userId),
                capital: Number(capital),
                income: Number(income),
                fixed_expense: Number(fixedExpense),
            });

            localStorage.setItem("financial_info", JSON.stringify(data));
            onNext();
        } catch (error) {
            console.error(error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page active">
            <StepNav currentStep={3} />
            <div className="section-container">
                <div className="section-header">
                    <div className="section-eyebrow">FINANCIAL INFO</div>
                    <h2>재정 정보 입력</h2>
                    <p>정확한 구매 추천을 위해 현재 재정 상태를 입력해 주세요.</p>
                </div>

                <div className="input-grid">
                    <div className="input-group full">
                        <label className="input-label">현재 자본 (CAPITAL)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="1000000"
                            value={capital}
                            onChange={(e) => setCapital(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">월 수입 (INCOME)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="0"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">고정 지출 (EXPENSE)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="0"
                            value={fixedExpense}
                            onChange={(e) => setFixedExpense(e.target.value)}
                        />
                    </div>
                </div>

                <div className="page-actions">
                    <button className="btn-secondary" onClick={onPrev}>
                        ← 이전
                    </button>
                    <button className="btn-primary" onClick={handleSaveFinancialInfo} disabled={loading}>
                        {loading ? "저장 중..." : "재정 정보 저장 →"}
                    </button>
                </div>
            </div>
        </div>
    );
}