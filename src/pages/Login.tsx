import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email === "amor@diario.com" && password === "senha123") {
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Bem-vinda de volta! ❤️");
      navigate("/");
    } else {
      toast.error("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-romantic-light via-background to-romantic-peach/20 p-4">
      <Card className="w-full max-w-md p-8 shadow-romantic">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-primary mb-2">Nosso Diário</h1>
          <p className="text-muted-foreground">Entre para adicionar novas memórias</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="amor@diario.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Entrar
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p className="mt-4 p-4 bg-muted rounded-lg">
              <strong>Credenciais de teste:</strong><br />
              Email: amor@diario.com<br />
              Senha: senha123
            </p>
          </div>
        </form>

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
