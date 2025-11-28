import { useState, useEffect } from "react";
import { DiaryHeader } from "@/components/DiaryHeader";
import { TimelineEntry } from "@/components/TimelineEntry";
import timeline1Main from "@/assets/timeline-1-main.jpg";
import timeline1Alt1 from "@/assets/timeline-1-alt1.jpg";
import timeline1Alt2 from "@/assets/timeline-1-alt2.jpg";
import timeline2Main from "@/assets/timeline-2-main.jpg";
import timeline2Alt1 from "@/assets/timeline-2-alt1.jpg";
import timeline2Alt2 from "@/assets/timeline-2-alt2.jpg";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const timelineEntries = [
    {
      title: "Nossa Primeira Vez na Praia",
      date: "15 de Janeiro, 2024",
      photos: [timeline1Main, timeline1Alt1, timeline1Alt2],
    },
    {
      title: "Cozinhando Juntos",
      date: "22 de Fevereiro, 2024",
      photos: [timeline2Main, timeline2Alt1, timeline2Alt2],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-romantic-light/30 to-background">
      <DiaryHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-romantic-pink via-romantic-coral to-romantic-peach" />
            
            {timelineEntries.map((entry, index) => (
              <TimelineEntry
                key={index}
                title={entry.title}
                date={entry.date}
                photos={entry.photos}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
