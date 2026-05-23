import { EMOJIS } from "../../../../constants";

export const ReactionPicker = (props) => {
  const { onSelect, onClose, isOwnMessage } = props

  return (
    <div className={`absolute bottom-full mb-4 ${isOwnMessage ? "right-16" : "left-0"} z-50 flex gap-1 bg-base-300 rounded-full px-2 py-1 shadow-xl border border-base-300`}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="text-lg hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
};
