"use client";

import { login, signup } from "@/lib/api";

import { useState } from "react";

type AuthPageProps = {
    onBack: () => void;
    onLoginSuccess: (name: string) => void;
};

type AuthTab = "login" | "signup";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function AuthPage({ onBack, onLoginSuccess }: AuthPageProps) {
    const [tab, setTab] = useState<AuthTab>("login");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const doLogin = async () => {
        if (!loginEmail || !loginPassword) {
            alert("이메일과 비밀번호를 입력해 주세요.");
            return;
        }

        try {
            setLoading(true);

            const data = await login({
                email: loginEmail,
                password: loginPassword,
            });

            if (data.message !== "로그인 성공") {
                alert(data.message);
                return;
            }

            localStorage.setItem("user_id", String(data.user_id));
            localStorage.setItem("user_name", data.name);
            localStorage.setItem("user_email", data.email);

            onLoginSuccess(data.name);
        } catch (error) {
            console.error(error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const doSignup = async () => {
        if (!signupName || !signupEmail || !signupPassword) {
            alert("이름, 이메일, 비밀번호를 모두 입력해 주세요.");
            return;
        }

        try {
            setLoading(true);

            const data = await signup({
                name: signupName,
                email: signupEmail,
                password: signupPassword,
            });

            alert(data.message);

            if (data.message === "회원가입 성공") {
                setTab("login");
                setLoginEmail(signupEmail);
                setLoginPassword(signupPassword);
            }
        } catch (error) {
            console.error(error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="page-auth" className="page active">
            <div className="auth-wrap">
                <div className="auth-card">
                    <div className="auth-logo">PDA</div>
                    <div className="auth-sub">PERSONAL DECISION ASSISTANT</div>

                    <div className="auth-notice">
                        🔒 로그인 또는 회원가입 후
                        <br />
                        DPTI 설문을 진행할 수 있습니다.
                    </div>

                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === "login" ? "active" : ""}`}
                            onClick={() => setTab("login")}
                        >
                            로그인
                        </button>
                        <button
                            className={`auth-tab ${tab === "signup" ? "active": ""}`}
                            onClick={() => setTab("signup")}
                        >
                            회원가입
                        </button>
                    </div>

                    {tab === "login" ? (
                        <div id="auth-login">
                            <div className="input-group">
                                <label className="input-label">EMAIL</label>
                                <input 
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: "28px" }}>
                                <label className="input-label">PASSWORD</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="비밀번호 입력"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>

                            <button className="btn-primary" style={{ width: "100%" }} onClick={doLogin} disabled={loading}>
                                {loading ? "처리 중..." : "로그인 후 설문 시작 →"}
                            </button>

                            <div className="auth-footer">
                                계정이 없으신가요?{" "}
                                <a onClick={() => setTab("signup")}>회원가입</a>
                            </div>
                        </div>
                    ) : (
                        <div id="auth-signup">
                            <div className="input-group">
                                <label className="input-label">NAME</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="이름을 입력하세요"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">EMAIL</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: "28px" }}>
                                <label className="input-label">PASSWORD</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="8자 이상 입력"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>

                            <button className="btn-primary" style={{ width: "100%" }} onClick={doSignup} disabled={loading}>
                                {loading ? "처리 중..." : "회원가입 후 설문 시작 →"}
                            </button>

                            <div className="auth-footer">
                                이미 계정이 있으신가요?{" "}
                                <a onClick={() => setTab("login")}>로그인</a>
                            </div>
                        </div>
                    )}
                    
                    <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <button className="btn-secondary" onClick={onBack}>
                            ← 홈으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}