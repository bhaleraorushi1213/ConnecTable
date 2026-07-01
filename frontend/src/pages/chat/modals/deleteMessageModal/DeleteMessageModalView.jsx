import { useChatStore } from "../../../../store/useChatStore.js";

const DeleteMessageModalView = (props) => {
  const { message, onClose } = props;
  const { deleteMessage } = useChatStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Delete Message</h2>
        <p className="mb-4">Are you sure you want to delete this message? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-base-300 text-base-content rounded hover:bg-base-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose(true)
              deleteMessage(message)
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div >
  )
}

export default DeleteMessageModalView