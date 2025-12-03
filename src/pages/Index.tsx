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
        enabled: logged, // só busca se estiver logado
    });

    console.log(memories);

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

                  <img src="https://love-notes-timeline-api-files-dev.s3.us-east-2.amazonaws.com/memories/813b8570-f061-70ca-ade0-27ab8989bf53/1764736628750-download.jpeg" alt="Teste" className="w-32 mx-auto mb-8"/>

                  {memories &&
                      memories.map((m, index) => {
                          // Normaliza as fotos: sempre vira array
                          const photos =
                              Array.isArray(m.fileKeys)
                                  ? m.fileKeys
                                  : m.fileKey
                                      ? [m.fileKey]
                                      : [];

                          console.log(photos);

                          return (
                              <TimelineEntry
                                  key={m.id}
                                  title={m.title}
                                  // se TimelineEntry espera Date, normaliza aqui:
                                  date={m.memoryDateIso ? m.memoryDate : m.memoryDate}
                                  photos={photos}
                                  isLeft={index % 2 === 0}
                              />
                          );
                      })}

              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
