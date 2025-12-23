import { LayoutGrid, Share2, Accessibility, MessageSquare } from "lucide-react";

export const TOOLS = [
    { key: "control", label: "Control",  Icon: LayoutGrid },
    { key: "share",   label: "Share",    Icon: Share2 },
    { key: "access",  label: "Access",   Icon: Accessibility },
    { key: "message", label: "Message",  Icon: MessageSquare },
] as const;
