import { useChatStore } from "../../../store/useChatStore.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

import { X, Send, Users } from "lucide-react";
import { getChatName } from "../../../lib/utils.js";

import Avatar from "../../../assets/default-avatar.png";

const ForwardMessageModalView = (props) => {
  const { selectedChats, handleToggle, handleForward, isForwarding, onClose} = props;
  const { users, forwardingMessage,  } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-base-200 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="size-5" />
          </button>
          <h2 className="text-white font-bold text-lg">Forward Message</h2>
          <button
            onClick={handleForward}
            disabled={!selectedChats.length || isForwarding}
            className="btn btn-primary btn-sm"
          >
            {isForwarding
              ? <span className="loading loading-spinner loading-xs" />
              : <Send className="size-4" />
            }
          </button>
        </div>

        {/* message preview */}
        <div className="px-4 py-3 border-b border-slate-700 bg-base-300/50">
          <p className="text-xs text-slate-400 mb-1">Forwarding:</p>
          <p className="text-sm text-white truncate">
            {forwardingMessage?.text || "📷 Image"}
          </p>
        </div>

        {/* chat list */}
        <div className="max-h-72 overflow-y-auto px-2 py-2">
          {users.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleToggle(chat._id)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-base-300 transition-colors"
            >
              {chat.isGroupChat ? (
                <div className="size-10 rounded-full bg-base-300 flex items-center justify-center border border-zinc-600">
                  <Users className="size-5 text-zinc-300" />
                </div>
              ) : (
                <img
                  src={chat.profilePicture || Avatar}
                  className="size-10 rounded-full object-cover"
                />
              )}
              <p className="flex-1 text-left text-sm font-medium text-white truncate">
                {getChatName(chat, authUser)}
              </p>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedChats.includes(chat._id)
                  ? "bg-primary border-primary"
                  : "border-slate-600"
                }`}
              >
                {selectedChats.includes(chat._id) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedChats.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-400">
            {selectedChats.length} chat{selectedChats.length > 1 ? "s" : ""} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default ForwardMessageModalView;