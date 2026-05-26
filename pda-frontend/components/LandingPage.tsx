type LandingPageProps = {
    onStart: () => void;
};

export default function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div id="page-landing" className="page active">
            <div className="hero">
                <div className="hero-glow"></div>
                <div className="hero-badge">PERSONAL DECISION ASSITANT</div>
                <h1>
                    당신의 소비,
                    <br />
                    지금 해도 될까요?
                </h1>
                <p>
                    DPTI 성향 분석 기반의 구매 의사결정 코치.
                    <br />
                    충동이 아닌 데이터로 선택하세요.
                </p>
                <div className="hero-actions">
                    <button className="btn-primary" onClick={onStart}>
                        지금 시작하기 →
                    </button>
                </div>
            </div>

            <div className="features">
                <div className="feature-card" data-num="01">
                    <div className="feature-icon">🧠</div>
                    <h3>DPTI 성향 분석</h3>
                    <p>
                        20문항 설문으로 충동형·계산형·목표형·감정형 중 당신의 의사결정 유형을 분석합니다.
                    </p>
                </div>

                <div className="feature-card" data-num="03">
                    <div className="feature-icon">⚡</div>
                    <h3>AI 구매 추천 알고리즘</h3>
                    <p>
                        가격 적합도·목적 적합도·성향 적합도를 종합한 Final Score로 구매 추천 여부를 판정합니다.
                    </p>
                </div>

                <div className="feature-card" data-num="03">
                    <div className="feature-icon">💡</div>
                    <h3>맞춤형 의사결정 코칭</h3>
                    <p>
                        왜 이 선택이 지금의 나에게 맞는지, 혹은 맞지 않는지 데이터 기반 이유를 설명합니다.
                    </p>
                </div>
            </div>
        </div>
    )
}