// src/pages/AddEntry.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FileIcon, UploadIcon } from "lucide-react";
import { createMemory, getPresignedUrl, uploadFileToPresignedUrl } from "@/lib/api";
import { DatePicker } from "@/components/DatePicker";
import { format } from "date-fns";

const AddEntry = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !date) {
            toast.error("Preencha o título e a data, meu amorzinho 💞");
            return;
        }

        try {
            let fileKey = "placeholder";

            // Upload do arquivo se existir
            if (file) {
                const { uploadUrl, fileKey: key } = await getPresignedUrl({
                    filename: file.name,
                    contentType: file.type || "application/octet-stream",
                });

                await uploadFileToPresignedUrl(uploadUrl, file);

                fileKey = key;
            }

            // Converter data selecionada para yyyy-MM-dd (sem fuso!)
            const memoryDate = format(date, "yyyy-MM-dd");

            await createMemory({
                title,
                description: "",
                fileKey,
                memoryDate,
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
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg">
            <h1 className="text-3xl font-semibold text-romantic-pink mb-6">
                Adicionar Memória 💖
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Título */}
                <div>
                    <label className="block mb-2 font-medium text-romantic-dark">
                        Título
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-md border border-romantic-light focus:outline-none focus:ring focus:ring-romantic-pink/40"
                        placeholder="Ex: Nosso primeiro encontro..."
                        required
                    />
                </div>

                {/* DatePicker */}
                <div>
                    <label className="block mb-2 font-medium text-romantic-dark">
                        Data da memória
                    </label>
                    <DatePicker date={date} onDateChange={setDate} placeholder="Escolha a data" />
                </div>

                {/* Upload de arquivo */}
                <div>
                    <label className="block mb-2 font-medium text-romantic-dark">
                        Foto (opcional)
                    </label>

                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer px-3 py-2 bg-romantic-pink text-white rounded-md hover:bg-romantic-coral transition flex items-center gap-2">
                            <UploadIcon size={18} />
                            Escolher arquivo
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) setFile(f);
                                }}
                            />
                        </label>

                        {file && (
                            <div className="flex items-center gap-2 text-romantic-dark">
                                <FileIcon size={20} />
                                <span>{file.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    className="w-full bg-romantic-pink text-white py-3 rounded-md font-semibold hover:bg-romantic-coral transition"
                >
                    Salvar memória 💌
                </button>
            </form>
        </div>
    );
};

export default AddEntry;
