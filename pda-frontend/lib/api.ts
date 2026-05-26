const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(url: string, options: RequestInit): Promise<T> {
    if (!API_BASE_URL) {
        throw new Error("API 주소가 설정되지 않았습니다.");
    }
    
    const res = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "요청 처리 중 오류가 발생했습니다.");
    }

    return data;
}

export function signup(data: {
    name: string;
    email: string;
    password: string;
}) {
    return request<{ message: string }>("/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function login(data: {
    email: string;
    password: string;
}) {
    return request<{
        message: string;
        user_id: number;
        name: string;
        email: string;
    }>("/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function submitDpti(userId: string, data: {
    impulse: number[];
    calculation: number[];
    target: number[];
    emotional: number[];
}) {
    return request<{
        dpti_type: string;
        scores: {
            Impulse: number;
            Calculation: number;
            Target: number;
            Emotional: number;
        };
    }>(`/dpti?user_id=${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function saveFinancialInfo(data: {
    user_id: number;
    capital: number;
    income: number;
    fixed_expense: number;
}) {
    return request("/financial-info", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function recommend(data: {
    user_id: number;
    product_name: string;
    price: number;
    purpose: string;
    description: string;
    need_level: number;
    urgency: number;
}) {
    return request("/recommend", {
        method: "POST",
        body: JSON.stringify(data),
    });
}