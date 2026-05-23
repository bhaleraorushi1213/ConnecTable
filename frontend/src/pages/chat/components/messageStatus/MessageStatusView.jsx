import { Check, CheckCheck } from "lucide-react";

const MessageStatusView = (props) => {
  const { status } = props;
  
  if (!status) return null;

  if (status === "sent") {
    return <Check className="size-3.5 text-base-content" />;
  }

  if (status === "delivered") {
    return <CheckCheck className="size-3.5 text-base-content" />;
  }

  if (status === "read") {
    return <CheckCheck className="size-3.5 text-primary" />;
  }

  return null;
};

export default MessageStatusView;