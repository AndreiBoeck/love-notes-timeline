import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/DatePicker";
import { createMemory, getPresignedUrl, uploadFileToPresignedUrl } from "@/lib/api";

export default function AddEntry() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !date) {
            toast.error("Por favor, preencha todos os campos");
            return;
        }

        try {
            let fileKey = "placeholder";

            if (file) {
                // 1) pega URL pré-assinada
                const { uploadUrl, fileKey: key } = await getPresignedUrl({
                    filename: file.name,
                    contentType: file.type || "application/octet-stream",
                });

                // 2) faz upload pro S3
                await uploadFileToPresignedUrl(uploadUrl, file);

                fileKey = key;
            }

            // 3) cria memória no DynamoDB
            await createMemory({
                title,
                description: "",
                fileKey,
                memoryDate: date.toISOString(),
            });

            toast.success("Memória adicionada com sucesso! ❤️");
            navigate("/");
        } catch (err: any) {
            console.error(err);
            toast.error("Erro ao salvar memória. Tenta de novo, amorzinho.");
        }
    };



    return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-light via-background to-romantic-peach/20 p-4 py-12">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 shadow-romantic">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Nova Memória</h1>
            <p className="text-muted-foreground">Guarde mais um momento especial nosso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Memória</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Nosso primeiro encontro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <DatePicker 
                date={date}
                onDateChange={setDate}
                placeholder="Escolha a data desta memória especial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Fotos</Label>

                <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const selected = e.target.files?.[0] || null;
                        setFile(selected);
                    }}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground"
                />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Salvar Memória
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
