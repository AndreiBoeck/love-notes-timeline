import { useState, useEffect } from "react";
import { DiaryHeader } from "@/components/DiaryHeader";
import { TimelineEntry } from "@/components/TimelineEntry";
import { isLoggedIn, logout } from "@/lib/auth";
import { listMemories, Memory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



const Index = () => {

    const [logged, setLogged] = useState(false);

    useEffect(() => {
        setLogged(isLoggedIn());
    }, []);

    const handleLogout = () => {
        logout();
        setLogged(false);
    };

    const { data: memories, isLoading, error } = useQuery({
        queryKey: ["memories"],
        queryFn: () => listMemories(),
        enabled: isLoggedIn, // só busca se estiver logado
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-romantic-light/30 to-background">
        <DiaryHeader isLoggedIn={logged} onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-romantic-pink via-romantic-coral to-romantic-peach" />
              <div className="space-y-8">
                  {isLoading && <p>Carregando memórias...</p>}
                  {error && <p>Erro ao carregar memórias.</p>}

                  {memories &&
                      memories.map((m, index) => (
                          <TimelineEntry
                              key={m.id}
                              title={m.title}
                              date={m.memoryDate}
                              photos={[]} // aqui depois você pode mapear fileKey -> URL do S3/CDN
                              isLeft={index % 2 === 0}
                          />
                      ))}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
