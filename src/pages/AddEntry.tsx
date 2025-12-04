import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Heart,
    ArrowLeft,
    UploadCloud,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/DatePicker";
import {
    createMemory,
    getPresignedUrl,
    uploadFileToPresignedUrl,
} from "@/lib/api";
import {format} from "date-fns";

export default function AddEntry() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | undefined>();
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files;
        if (!selected) return;

        const newFiles = Array.from(selected);

        setFiles((prev) => {
            // evita duplicados (mesmo nome/tamanho/lastModified)
            const existingKeys = new Set(
                prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`)
            );

            const filteredNew = newFiles.filter(
                (f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`)
            );

            return [...prev, ...filteredNew];
        });

        // permite selecionar o mesmo arquivo de novo se quiser
        event.target.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !date) {
            toast.error("Preenche o título e a data, amorzinho 💞");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1) Faz upload de TODAS as imagens (se tiver)
            const fileKeys: string[] = [];

            for (const file of files) {
                const { uploadUrl, fileKey } = await getPresignedUrl({
                    filename: file.name,
                    contentType: file.type || "application/octet-stream",
                });

                await uploadFileToPresignedUrl(uploadUrl, file);
                fileKeys.push(fileKey);
            }

            // 2) Data escolhida no DatePicker, formato dd-mm-yyyy
            const memoryDate = format(date, "yyyy-MM-dd");

            // 3) Cria a memória no back
            //    👉 imagens são opcionais, mas sempre mandamos fileKeys (pode ser [])
            await createMemory({
                title,
                description,
                memoryDate,
                fileKeys,
            });

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
                                Nova memória nossa 💖
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Registra mais um momento fofinho na linha do tempo.
                            </p>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* TÍTULO */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Título da memória</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Ex: Nosso primeiro encontro"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder="Ex: Onde ele foi, como ele foi..."
                                className="min-h-[120px] resize-y"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>


                        {/* DATA */}
                        <div className="space-y-2">
                            <Label>Data da memória</Label>
                            <DatePicker
                                date={date}
                                onDateChange={setDate}
                                placeholder="Escolhe a data desse momento"
                            />
                        </div>

                        {/* IMAGENS */}
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
                                                <span className="max-w-[160px] truncate">
                          {file.name}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {files.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Se quiser, pode salvar sem foto também 💌
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
                            {isSubmitting ? "Salvando..." : "Salvar memória 💌"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
