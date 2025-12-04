import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokenFromHash } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        saveTokenFromHash(window.location.hash);
        navigate("/", { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finalizando login...</span>
            </div>
        </div>
    );
}
