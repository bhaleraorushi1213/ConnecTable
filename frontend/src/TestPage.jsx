import { useState } from "react";


const Test = () => {
  const[isHidden, setIsHidden] = useState(false);

  const handleClickBtn = () => {
    setIsHidden(!isHidden);
  }
  return (
    <div className="flex items-start justify-start">
      {/* TestPage */}
      <button onClick={handleClickBtn} id="toggleBtn" className="p-2 bg-blue-500 text-white rounded flex items-center justify-center">
        Toggle Sidebar
      </button>

      <div class="flex mt-4">
        {/* <!-- Sidebar --> */}
        <aside id="sidebar" className={`w-64 bg-gray-800 text-white h-screen p-4 ${isHidden ? "hidden" : ""}`}>
          <nav>
            <ul>
              <li className="py-2">Dashboard</li>
              <li className="py-2">Settings</li>
            </ul>
          </nav>
        </aside>

        {/* <!-- Main Content --> */}
        <main className="flex-1 p-4 bg-gray-100">
          Main content goes here...
        </main>
      </div>
    </div>
  )
}

export default Test