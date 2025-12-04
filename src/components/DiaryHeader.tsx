import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";

interface DiaryHeaderProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export const DiaryHeader = ({ isLoggedIn, onLogout }: DiaryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="relative w-full overflow-hidden">
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 romantic-gradient opacity-70" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <Heart className="w-16 h-16 text-white mb-4 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Nosso Diário de Amor
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow">
            Cada momento juntos é uma memória preciosa que guardo no coração
          </p>
          {isLoggedIn && (
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => navigate("/add-entry")}
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Adicionar Memória
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white hover:bg-white/20"
              >
                Sair
              </Button>
            </div>
          )}
          {!isLoggedIn && (
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="mt-8 bg-white text-primary hover:bg-white/90"
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
