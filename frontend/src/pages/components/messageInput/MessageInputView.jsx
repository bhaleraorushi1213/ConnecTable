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

  return (
    <div className="p-4 w-full">
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
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 text-white flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-base-200 text-slate-100 placeholder:text-slate-300"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden bg-emerald-500 hover:bg-emerald-700 sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-5 text-white" />
          </button>
        </div>
        <button
          type="submit"
          className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-800"
          disabled={(!text.trim() && !imagePreview) || isMessageSending}
        >
          <Send className="size-5 lg:size-6 text-white" />
        </button>
      </form>
    </div>
  )
}

export default MessageInputView