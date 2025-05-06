import React from "react";
import { useState } from "react";
import AddItemForm from "./AddItemForm";
import "./InventoryTable.scss";

const InventoryTable = () => {
  const inventoryItems = [
    {
      id: 1,
      name: "Linen Blouse",
      cost: 12,
      platform: "eBay",
      location: "Bin A",
      status: "Available",
      sellingPrice: 28,
    },
    {
      id: 2,
      name: "Vintage Bag",
      cost: 8,
      platform: "Poshmark",
      location: "Shelf 2",
      status: "Sold",
      sellingPrice: 35,
    },
  ];
  const [editingItemId, setEditingItemId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(inventoryItems); // from static array

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const calculateProfit = (item) => {
    return item.status === "Sold"
      ? (item.sellingPrice - item.cost).toFixed(2)
      : "-";
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const updateItemField = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };  
  const saveEditedItem = (updatedItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    setEditingItemId(null);
  };
  

  return (
    <div className="inventory-table">
      <div className="inventory-header">
        <h2>Inventory</h2>
        <button className="new-item-btn" onClick={() => setShowForm(true)}>
          + New Item
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Platform</th>
            <th>Location</th>
            <th>Status</th>
            <th>Selling Price</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
        {items.map((item) => (
  <React.Fragment key={item.id}>
  {editingItemId === item.id ? (
    // Render editable row
    <tr>
      <td>
        <input
          value={item.name}
          onChange={(e) => updateItemField(item.id, "name", e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          value={item.cost}
          onChange={(e) => updateItemField(item.id, "cost", e.target.value)}
        />
      </td>
      <td>
        <input
          value={item.platform}
          onChange={(e) => updateItemField(item.id, "platform", e.target.value)}
        />
      </td>
      <td>
        <input
          value={item.location}
          onChange={(e) => updateItemField(item.id, "location", e.target.value)}
        />
      </td>
      <td>
        <select
          value={item.status}
          onChange={(e) =>
            updateItemField(item.id, "status", e.target.value)
          }
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          value={item.sellingPrice || ""}
          onChange={(e) =>
            updateItemField(item.id, "sellingPrice", e.target.value)
          }
        />
      </td>
      <td>{calculateProfit(item)}</td>
      <td>
        <button onClick={() => saveEditedItem(item)}>Save</button>
        <button onClick={() => setEditingItemId(null)}>Cancel</button>
      </td>
    </tr>
  ) : (
    // Render regular row
    <tr>
      <td>{item.name}</td>
      <td>${item.cost}</td>
      <td>{item.platform}</td>
      <td>{item.location}</td>
      <td>
        <select
          value={item.status}
          onChange={(e) =>
            updateItemField(item.id, "status", e.target.value)
          }
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </td>
      <td>{item.status === "Sold" ? `$${item.sellingPrice}` : "-"}</td>
      <td>{calculateProfit(item)}</td>
      <td>
        <button onClick={() => setEditingItemId(item.id)}>Edit</button>
      </td>
    </tr>
  )}
</React.Fragment>

))}

        </tbody>
      </table>
      {/* Form modal goes here */}
      {showForm && (
        <AddItemForm
          onAddItem={handleAddItem}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default InventoryTable;
