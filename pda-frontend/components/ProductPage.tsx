"use client";

import { recommend } from "@/lib/api";

import { useState } from "react";
import StepNav from "@/components/StepNav";

const API_BASE_URL = "http://127.0.0.1:8000";

type ProductPageProps = {
    onPrev: () => void;
    onSuccess: () => void;
};

export default function ProductPage({ onPrev, onSuccess }: ProductPageProps) {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [purpose, setPurpose] = useState("");
    const [description, setDescription] = useState("");
    const [needLevel, setNeedLevel] = useState(3);
    const [urgency, setUrgency] = useState(3);
    const [loading, setLoading] = useState(false);

    const runAnalysis = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        if (!productName || !price || !purpose || !description) {
            alert("상품 정보를 모두 입력해 주세요.");
            return;
        }

        try {
            setLoading(true);

            const data = await recommend({
                user_id: Number(userId),
                product_name: productName,
                price: Number(price),
                purpose,
                description,
                need_level: needLevel,
                urgency,
            });

            localStorage.setItem("recommend_result", JSON.stringify(data));
            localStorage.setItem(
                "product_input",
                JSON.stringify({
                    product_name: productName,
                    price: Number(price),
                    purpose,
                    description,
                    need_level: needLevel,
                    urgency,
                })
            );

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
            <StepNav currentStep={4} />
            <div className="section-container">
                <div className="section-header">
                    <div className="section-eyebrow">PRODUCT INFO</div>
                    <h2>상품 정보 입력</h2>
                    <p>구매를 고민하는 상품의 정보를 입력해 주세요.</p>
                </div>

                <div className="input-grid">
                    <div className="input-group full">
                        <label className="input-label">상품명 (PRODUCT NAME)</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="예: 맥북 에어 M3"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div className="input-group full">
                        <label className="input-label">가격 (PRICE)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="200000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="input-group full">
                        <label className="input-label">구매 목적 (PURPOSE)</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="예: 노트북 공부"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </div>

                    <div className="input-group full">
                        <label className="input-label">상품 설명 (DESCRIPTION)</label>
                        <textarea
                            className="input-field"
                            placeholder="예: 코딩용 노트북"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="input-group full">
                        <label className="input-label">필요도 (1~5)</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={needLevel}
                            onChange={(e) => setNeedLevel(Number(e.target.value))}
                        />
                        <div className="range-value">{needLevel}</div>
                    </div>

                    <div className="input-group full">
                        <label className="input-label">긴급도 (1~5)</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={urgency}
                            onChange={(e) => setUrgency(Number(e.target.value))}
                        />
                        <div className="range-value">{urgency}</div>
                    </div>
                </div>

                <div className="page-actions">
                    <button className="btn-secondary" onClick={onPrev}>
                        ← 이전
                    </button>
                    <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
                        {loading ? "분석 중..." : "분석 시작 →"}
                    </button>
                </div>
            </div>
        </div>
    );
}