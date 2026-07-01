import { useChatStore } from "../../../../store/useChatStore.js";
import { Image, Send, X } from "lucide-react";

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

  const isSendDisabled = (!text.trim() && !imagePreview) || isMessageSending;

  return (
    <footer className="p-4 w-full aboslute bottom-0">

      {imagePreview && !replyingTo && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300/80"
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

      {replyingTo && imagePreview ? (
        <div className="flex flex-col justify-between mb-2 px-3 py-2 bg-base-300 rounded-lg border-l-4 border-primary">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-base-300/80"
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
          <div className="flex items-center justify-between">
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
              <X className="size-6" />
            </button>
          </div>
        </div>
      ) : replyingTo && (
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
            <X className="size-6" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2 lg:gap-4 items-center">
          <div className="flex flex-1 relative">
            <input
              type="text"
              className=" w-full input input-bordered rounded-lg input-md bg-base-200 text-lg text-base-content placeholder:text-base-content placeholder:text-base-content/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-12"
              placeholder="Type a message..."
              value={text}
              onChange={handleTyping}
            />
            {/* <Mic className="absolute right-2 top-1.5 lg:right-2 lg:top-1/4 size-5 lg:size-6 hover:text-base-content cursor-pointer" /> */}
            <div className="absolute right-2 text-center top-1.5 text-base-content">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className={` ${imagePreview ? "text-base-content/80" : "text-base-content hover:text-base-content/80"} `}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="size-8" />
              </button>
            </div>
          </div>



          {/* Send button */}
          <button
            type="submit"
            className={`p-2 lg:p-3 rounded-full bg-primary/50 ${!isSendDisabled && "hover:scale-105"}`}
            disabled={isSendDisabled}
          > {
              isMessageSending ? <span className="flex justify-center items-center loading loading-spinner size-5 lg:size-7 rounded-full text-base-content" /> :
                <Send className="size-7 text-base-content flex justify-center items-center" />
            }

          </button>
        </div>
      </form>
    </footer>
  )
}

export default MessageInputView