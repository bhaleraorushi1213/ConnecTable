import { Check, CheckCheck } from "lucide-react";

const MessageStatusView = ({ status }) => {
  if (!status) return null;

  if (status === "sent") {
    return <Check className="size-3.5 text-slate-400" />;
  }

  if (status === "delivered") {
    return <CheckCheck className="size-3.5 text-slate-400" />;
  }

  if (status === "read") {
    return <CheckCheck className="size-3.5 text-primary" />;
  }

  return null;
};

export default MessageStatusView;