import React, { useState } from 'react';
import 'antd/dist/reset.css'; // Ant Design styles
import './App.css';
import Modal from './components/Modal/Modal';
import TaskCreate from './components/TaskCreate/TaskCreate';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
        <div className="click-me-button" onClick={openModal}>
          Click Me
        </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TaskCreate onClose={closeModal} />
      </Modal>
    </div>
  );
}

export default App;
