"use client";

import { useEffect, useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import SurveyPage from "@/components/SurveyPage";
import DptiResultPage from "@/components/DptiResultPage";
import FinancePage from "@/components/FinancePage";
import ProductPage from "@/components/ProductPage";
import ResultPage from "@/components/ResultPage";

export type PageType =
  | "landing"
  | "auth"
  | "survey"
  | "dpti-result"
  | "finance"
  | "product"
  | "result";

export default function HomePage() {
  const [page, setPage] = useState<PageType>("landing");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const savedUserName = localStorage.getItem("user_name");
    const savedRecommendResult = localStorage.getItem("recommend_result");
    const savedProductInput = localStorage.getItem("product_input");
    const savedFinancialInfo = localStorage.getItem("financial_info");
    const savedDptiResult = localStorage.getItem("dpti_result");
    const savedUserId = localStorage.getItem("user_id");

    if (savedUserName) {
      setUserName(savedUserName);
    }

    if (!savedUserId) {
      setPage("landing");
      return;
    }

    if (savedRecommendResult && savedProductInput) {
      setPage("result");
    } else if (savedFinancialInfo) {
      setPage("product");
    } else if (savedDptiResult) {
      setPage("finance");
    } else {
      setPage("survey");
    }
  }, []);

  return (
    <>
      <nav>
        <div className="nav-logo" onClick={() => setPage("landing")}>
          PDA <span>BETA</span>
        </div>

        <div className="nav-right">
          {!userName ? (
            <div id="nav-guest">
              <button className="nav-btn nav-cta" onClick={() => setPage("auth")}>
                시작하기
              </button>
            </div>
          ) : (
            <div className="nav-user show">
              <div className="nav-avatar">{userName[0]?.toUpperCase()}</div>
              <span className="nav-username">{userName}</span>
              <button
                className="nav-btn"
                style={{ fontSize: "12px" }}
                onClick={() => {
                  localStorage.clear();
                  setUserName("");
                  setPage("landing");
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </nav>

      {page === "landing" && <LandingPage onStart={() => setPage("auth")} />}

      {page === "auth" && (
        <AuthPage
          onBack={() => setPage("landing")}
          onLoginSuccess={(name) => {
            setUserName(name);
            setPage("survey");
          }}
        />
      )}

      {page === "survey" && (
        <SurveyPage
          onSuccess={() => {
            setPage("dpti-result");
          }}
        />
      )}

      {page === "dpti-result" && (
        <DptiResultPage
          onPrev={() => setPage("survey")}
          onNext={() => setPage("finance")}
        />
      )}

      {page === "finance" && (
        <FinancePage
          onPrev={() => setPage("dpti-result")}
          onNext={() => setPage("product")}
        />
      )}

      {page === "product" && (
        <ProductPage
          onPrev={() => setPage("finance")}
          onSuccess={() => setPage("result")}
        />
      )}

      {page === "result" && (
        <ResultPage
          onPrev={() => setPage("product")}
          onRestart={() => setPage("product")}
        />
      )}
    </>
  );
}