type StepNavProps = {
  currentStep: 1 | 2 | 3 | 4 | 5;
};

const STEP_LABELS = [
  "DPTI 설문",
  "성향 결과",
  "재정 정보",
  "상품 입력",
  "추천 결과",
];

export default function StepNav({ currentStep }: StepNavProps) {
  return (
    <div className="step-nav">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div className="step-item" key={label}>
            <div
              className={`step-dot ${isDone ? "done" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              <div className="step-circle">
                {isDone ? "✓" : String(stepNumber).padStart(2, "0")}
              </div>
              <span className="step-name">{label}</span>
            </div>

            {stepNumber < STEP_LABELS.length && <div className="step-line"></div>}
          </div>
        );
      })}
    </div>
  );
}