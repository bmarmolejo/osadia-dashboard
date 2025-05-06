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
    <tr>
      <td>{item.name}</td>
      <td>${item.cost}</td>
      <td>{item.platform}</td>
      <td>{item.location}</td>
      <td>
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </td>
      <td>{item.status === "Sold" ? `$${item.sellingPrice}` : "-"}</td>
      <td>{calculateProfit(item)}</td>
    </tr>

    {item.status === "Sold" && !item.sellingPrice && (
      <tr className="sold-details-row">
        <td colSpan="7">
          <input
            type="number"
            placeholder="Selling Price"
            onChange={(e) =>
              updateItemField(item.id, "sellingPrice", e.target.value)
            }
          />
          <input
            type="date"
            placeholder="Sale Date"
            onChange={(e) =>
              updateItemField(item.id, "saleDate", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Platform Fee or Shipping Cost"
            onChange={(e) =>
              updateItemField(item.id, "platformFees", e.target.value)
            }
          />
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
