import React from "react";
import { useState } from "react";
import AddItemForm from "./AddItemForm";
import "./InventoryTable.scss";
import TrashIcon from "../assets/trash.svg";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const InventoryTable = () => {
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/inventory")
      .then((res) => {
        // Mapping each item to match front end naming
        const mappedItems = res.data.map((item) => ({
          id: item.id,
          name: item.item_name, // "Item"
          cost: item.cost, // "COGS"
          platform: item.listed_channels, // "Platform"
          location: item.bin_number, // "Location"
          status: item.is_sold ? "Sold" : "Available", // "Status"
          sellingPrice: item.selling_price, // "Selling Price"
          profit: item.profit, // "Profit"
        }));
        setItems(mappedItems);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
      });
  }, []);

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

  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteItem = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  return (
    <div className="inventory-table">
      <div className="inventory-header">
        <h2>Inventory</h2>
        <div className="inventory-header__actions">
          <input
            type="text"
            placeholder="Search by name..."
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)} // optional logic
          />
          <button className="new-item-btn" onClick={() => setShowForm(true)}>
            + New Item
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>COGS</th>
            <th>Platform</th>
            <th>Location</th>
            <th>Status</th>
            <th>Selling Price</th>
            <th>Profit</th>
            <th>Fees</th>
            <th>Shipping</th>
            <th>Min Price</th>
            <th>Actions</th>
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
                      onChange={(e) =>
                        updateItemField(item.id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) =>
                        updateItemField(item.id, "cost", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={item.platform}
                      onChange={(e) =>
                        updateItemField(item.id, "platform", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="eBay US">eBay US</option>
                      <option value="eBay CA">eBay CA</option>
                      <option value="Poshmark US">Poshmark US</option>
                      <option value="Poshmark CA">Poshmark CA</option>
                      <option value="Marketplace">Marketplace</option>
                      <option value="Etsy">Etsy</option>
                      <option value="Shopify">Shopify</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/location/${item.location}`}>
                      {item.location}
                    </Link>
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
                    <div className="button-group">
                      <button
                        className="save"
                        onClick={() => saveEditedItem(item)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel"
                        onClick={() => setEditingItemId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Render regular row
                <tr>
                  <td>{item.name}</td>
                  <td>${item.cost}</td>
                  <td>
                    <select
                      value={item.platform}
                      onChange={(e) =>
                        updateItemField(item.id, "platform", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="eBay US">eBay US</option>
                      <option value="eBay CA">eBay CA</option>
                      <option value="Poshmark US">Poshmark US</option>
                      <option value="Poshmark CA">Poshmark CA</option>
                      <option value="Marketplace">Marketplace</option>
                      <option value="Etsy">Etsy</option>
                      <option value="Shopify">Shopify</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td>${item.fees}</td>
                  <td>${item.shipping_cost}</td>
                  <td>${item.minimum_selling_price}</td>
                  <td>
                    <Link to={`/location/${item.location}`}>
                      {item.location}
                    </Link>
                  </td>{" "}
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
                    {item.status === "Sold" ? `$${item.sellingPrice}` : "-"}
                  </td>
                  <td>{calculateProfit(item)}</td>
                  <td className="action-buttons">
                    <button
                      className="edit"
                      onClick={() => setEditingItemId(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <img
                        src={TrashIcon}
                        alt="Delete"
                        className="icon-trash"
                      />
                    </button>
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
