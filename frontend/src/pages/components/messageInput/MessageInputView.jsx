import { Image, Mic, Send, X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";

const MessageInputView = (props) => {
  const {
    text,
    imagePreview,
    isMessageSending,
    fileInputRef,
    handleTyping,
    handleSendMessage,
    handleImageChange,
    removeImage
  } = props;

  const { replyingTo, clearReplyingTo } = useChatStore();

  return (
    <footer className="p-4 w-full relative bottom-0">
      {/* reply preview */}
      {replyingTo && (
        <div className="flex items-center justify-between mb-2 px-3 py-2 bg-base-300 rounded-lg border-l-4 border-primary">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-primary font-semibold">
              Replying to {replyingTo.senderId?.fullName || "Unknown"}
            </span>
            <span className="text-xs text-base-content/60 truncate">
              {replyingTo.text || "📷 Image"}
            </span>
          </div>
          <button
            onClick={clearReplyingTo}
            className="ml-2 text-base-content/60 hover:text-base-content transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 text-base-content flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2 lg:gap-4 items-center">
          <div className="flex flex-1 relative">

            <input
              type="text"
              className=" w-full input input-bordered rounded-lg input-sm sm:input-md bg-base-200 text-base-content placeholder:text-slate-300"
              placeholder="Type a message..."
              value={text}
              onChange={handleTyping}
            />
            <Mic className="absolute right-2 top-1.5 lg:right-2 lg:top-1/4 size-5 lg:size-6 hover:text-base-content cursor-pointer" />
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        {/* Image button */}
          <button
            type="button"
            className={`bg-emerald-500 hover:bg-emerald-700 rounded-full p-2 lg:p-4 ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-5 lg:size-6 text-base-content" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            className="p-2 lg:p-4 rounded-full bg-cyan-600 hover:bg-cyan-800"
            disabled={(!text.trim() && !imagePreview) || isMessageSending}
          > {
              isMessageSending ? <span className="loading loading-spinner text-base-content" /> :
                <Send className="size-5 lg:size-6 text-base-content" />
            }

          </button>
        </div>
      </form>
    </footer>
  )
}

export default MessageInputView