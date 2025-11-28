import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft, UploadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/DatePicker";
import {
    createMemory,
    getPresignedUrl,
    uploadFileToPresignedUrl,
} from "@/lib/api";
import { format } from "date-fns";

export default function AddEntry() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | undefined>();
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !date) {
            toast.error("Preenche o título e a data, amorzinho 💞");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1) Upload das imagens (se tiver)
            const fileKeys: string[] = [];

            for (const file of files) {
                try {
                    const { uploadUrl, fileKey } = await getPresignedUrl({
                        filename: file.name,
                        contentType: file.type || "application/octet-stream",
                    });

                    await uploadFileToPresignedUrl(uploadUrl, file);
                    fileKeys.push(fileKey);
                } catch (err) {
                    console.error("Erro ao enviar arquivo:", file.name, err);
                    toast.error(`Erro ao enviar a imagem "${file.name}" 😥`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2) Data escolhida no DatePicker em formato yyyy-MM-dd
            const memoryDate = format(date, "yyyy-MM-dd");

            // 3) Criar memória no back
            await createMemory({
                title,
                description: "",
                // se o back ainda estiver esperando um único fileKey,
                // você pode temporariamente usar fileKeys[0] aqui
                fileKeys, // <- ideal: o back aceitar um array
                memoryDate,
            } as any); // "as any" enquanto o tipo do createMemory não for ajustado para fileKeys

            toast.success("Memória adicionada com sucesso! ❤️");
            navigate("/");
        } catch (err: any) {
            console.error("Erro ao criar memória:", err);
            toast.error(
                err instanceof Error
                    ? `Erro ao salvar memória: ${err.message}`
                    : "Erro ao salvar memória 😥"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files;
        if (!selected) return;

        const arr = Array.from(selected);
        setFiles(arr);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-romantic-light/30 to-background">
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>

                <Card className="max-w-2xl mx-auto p-6 shadow-romantic">
                    <div className="flex items-center gap-3 mb-6">
                        <Heart className="w-6 h-6 text-primary animate-pulse" />
                        <div>
                            <h1 className="text-2xl font-bold text-primary">
                                Nova memória de vocês 💖
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Registra mais um momento fofinho na linha do tempo.
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Título */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Nosso primeiro encontro"
                            />
                        </div>

                        {/* Data */}
                        <div className="space-y-2">
                            <Label>Data da memória</Label>
                            <DatePicker
                                date={date}
                                onDateChange={setDate}
                                placeholder="Escolhe a data desse momento"
                            />
                        </div>

                        {/* Upload de várias imagens */}
                        <div className="space-y-2">
                            <Label>Fotos (pode mandar várias 🥵)</Label>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-border rounded-lg p-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
                                    <UploadCloud className="w-5 h-5" />
                                    <span>Selecionar imagens</span>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFilesChange}
                                    />
                                </label>

                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {files.map((file) => (
                                            <div
                                                key={file.name + file.size}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted"
                                            >
                                                <ImageIcon className="w-3 h-3" />
                                                <span className="max-w-[140px] truncate">
                          {file.name}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {files.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Você pode salvar a memória sem foto também, se quiser.
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Salvar Memória 💌"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
