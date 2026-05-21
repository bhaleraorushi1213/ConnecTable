import NewChatList from '../components/newChatList/NewChatList';
import NewGroupScreen from '../components/newGroupScreen/NewGroupScreen';

const NewChatModalView = (props) => {
  const { handleBack, view, setView } = props;

  return (
    <div className="fixed inset-0 z-50 bg-[#13111c]/80 flex items-center justify-center md:p-8 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full md:max-w-2xl h-full md:h-auto md:max-h-[85vh] bg-sidebar-dark md:rounded-2xl shadow-2xl border-none md:border border-slate-800 flex flex-col overflow-hidden transition-all duration-300">

        {/* Render different views based on state */}
        {view === 'list' && (
          <NewChatList onNavigate={setView} />
        )}

        {view === 'newGroup' && (
          <NewGroupScreen onBack={handleBack} />
        )}
      </div>
    </div>
  )
}

export default NewChatModalView