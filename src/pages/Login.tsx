import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { buildLoginUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const domain = import.meta.env.VITE_COGNITO_DOMAIN;
        const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

        const url =
            `${domain}/login?client_id=${clientId}` +
            `&response_type=token&scope=openid+email` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}`;

        window.location.href = url;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-light via-background to-romantic-peach/20 p-4">
            <Card className="w-full max-w-md p-8 shadow-romantic">
                <div className="text-center mb-8">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                    <h1 className="text-3xl font-bold text-primary mb-2">Nosso Diário</h1>
                    <p className="text-muted-foreground">
                        Você será redirecionado para a página segura de login
                    </p>
                </div>

                <Button className="w-full" size="lg" onClick={handleLogin}>
                    Entrar com Cognito
                </Button>

                <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigate("/")}
                >
                    Voltar
                </Button>
            </Card>
        </div>
    );
}
