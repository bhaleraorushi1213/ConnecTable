Try this web app on the following link 

# ConnecTable 💬

A full-stack real-time chat application with one-on-one and group messaging, built with the MERN stack and Socket.io.

🔗 **Live Demo:** https://connectable-3bz9.onrender.com/

---

## Features

### Messaging
- Real-time one-on-one and group chat via Socket.io
- Typing indicators
- Message reactions (emoji)
- Reply to specific messages
- Forward messages to other chats
- Delete your own messages
- Message search within a conversation
- Image sharing (Cloudinary)
- Infinite scroll / paginated message history
- Read receipts and delivery status (sent / delivered / read ticks)
- Unread message badges, sorted conversation list by latest activity

### Groups
- Create groups with multiple participants and a custom group photo
- Admin controls: add/remove members, update group name and photo
- Leave group
- Real-time group membership updates

### Presence & Notifications
- Online/offline status with "last seen" timestamps
- Sound notifications (customizable volume)
- Browser push notifications when the app is in the background
- Auto-reconnect with message delivery on reconnect

### User Experience
- Light/dark and multiple daisyUI theme support
- Responsive design (mobile + desktop layouts)
- Editable user profiles with bio and avatar
- Account deletion

---

## Tech Stack

**Frontend**
- React + Vite
- Zustand (state management)
- Tailwind CSS + daisyUI
- Socket.io-client
- React Router

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT authentication
- Cloudinary (image/media storage)
- bcrypt (password hashing)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Cloudinary account
- Tenor API key (optional, for GIF support)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/connectable.git
cd connectable

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory:

```env
VITE_TENOR_API_KEY=your_tenor_api_key
```

### Running Locally

```bash
# Start the backend (from /backend)
npm run dev

# Start the frontend (from /frontend)
npm run dev
```

The app will be available at `http://localhost:5173`, with the API running on `http://localhost:5001`.

---

## Project Structure

```
connectable/
├── backend/
│   ├── controllers/      # Route handlers (auth, chat, message)
│   ├── lib/               # Socket.io, Cloudinary, DB config
│   ├── models/             # Mongoose schemas
│   ├── routes/              # Express routes
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── store/            # Zustand stores
│   │   └── lib/               # Utilities (sounds, notifications, etc.)
│   └── vite.config.js
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
