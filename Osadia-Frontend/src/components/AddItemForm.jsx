import React, { useState } from 'react';
import './AddItemForm.scss';

const AddItemForm = ({ onAddItem, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    platform: '',
    location: '',
    status: 'Available',
    sellingPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem({ ...formData, id: Date.now() });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Item</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Item Name" onChange={handleChange} required />
          <input name="cost" type="number" placeholder="Cost" onChange={handleChange} required />
          <input name="platform" placeholder="Platform" onChange={handleChange} required />
          <input name="location" placeholder="Location" onChange={handleChange} required />
          <select name="status" onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
          <input name="sellingPrice" type="number" placeholder="Selling Price" onChange={handleChange} />
          <button type="submit">Add Item</button>
          <button type="button" className="cancel" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
