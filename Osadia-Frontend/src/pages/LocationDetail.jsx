import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import TrashIcon from "../assets/trash.svg";
import "../components/InventoryTable"; // reuse inventory styles

const LocationDetail = () => {
  const { binNumber } = useParams();
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/inventory")
      .then((res) => {
        const filtered = res.data
          .filter((item) => item.bin_number === binNumber)
          .map((item) => ({
            id: item.id,
            name: item.item_name,
            cost: item.cost,
            platform: item.listed_channels,
            sellingPrice: item.selling_price,
            profit: item.profit,
            status: item.is_sold ? "Sold" : "Available",
          }));
        setItems(filtered);
      })
      .catch((err) => {
        console.error("Error fetching location details:", err);
      });
  }, [binNumber]);

  if (items.length === 0) {
    return (
      <div className="inventory-table">
        <p>No items found for {binNumber}</p>
      </div>
    );
  }

  const updateItemField = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const saveEditedItem = (updatedItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="inventory-table">
      <div className="inventory-header">
        <Link to="/inventory" className="back-button">
          ← Back to Inventory
        </Link>
        <h2>{binNumber} Details</h2>
        <div className="inventory-header__actions">
          <input
            type="text"
            placeholder="Search by name..."
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="new-item-btn">Edit</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>COGS</th>
            <th>Platform</th>
            <th>Selling Price</th>
            <th>Profit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {editingItemId === item.id ? (
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
                    <input
                      value={item.platform}
                      onChange={(e) =>
                        updateItemField(item.id, "platform", e.target.value)
                      }
                    />
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
                  <td>{item.profit}</td>
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
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>{item.name}</td>
                  <td>${item.cost}</td>
                  <td>{item.platform}</td>
                  <td>${item.sellingPrice}</td>
                  <td>{item.profit}</td>
                  <td>{item.status}</td>
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
    </div>
  );
};

export default LocationDetail;
