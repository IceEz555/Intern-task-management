import { X } from 'lucide-react';
import "../../assets/styles/Modal.css";
const Modal = ({ open, onClose, title, children, size }) => {
    if (!open) return null;
    return (
        <div>
            <div className="modal-overlay">
                <div className={`modal-content ${size || ''}`}>
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button className='btn-close' onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;