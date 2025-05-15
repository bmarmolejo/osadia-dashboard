import React, { useState, useEffect } from "react";
import AddItemForm from "./AddItemForm";
import "./InventoryTable.scss";
import TrashIcon from "../assets/trash.svg";
import axios from "axios";
import { Link } from "react-router-dom";

const InventoryTable = () => {
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/inventory")
      .then((res) => {
        const mappedItems = res.data.map((item) => ({
          id: item.id,
          name: item.item_name,
          cost: item.cost,
          platform: item.listed_channels,
          fees: item.fees,
          shipping_cost: item.shipping_cost,
          sellingPrice: item.selling_price,
          profit: item.profit,
          minimum_selling_price: item.minimum_selling_price,
          location: item.bin_number,
          status: item.is_sold ? "Sold" : "Available",
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
    const price = parseFloat(item.sellingPrice) || 0;
    const cost = parseFloat(item.cost) || 0;
    const fees = parseFloat(item.fees) || 0;
    const shipping = parseFloat(item.shipping_cost) || 0;
  
    return (price - cost - shipping - fees).toFixed(2);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setItems(updatedItems);
  };

  const updateItemField = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
  
        const platform = field === "platform" ? value : item.platform;
        const cost = field === "cost" ? value : item.cost;
        const sellingPrice = field === "sellingPrice" ? value : item.sellingPrice;
  
        updatedItem.shipping_cost = getShippingCostByPlatform(platform);
        updatedItem.fees = calculateFees(platform, sellingPrice);
        updatedItem.profit = calculateProfit({ ...updatedItem, sellingPrice });
        updatedItem.minimum_selling_price = calculateMinPrice(platform, cost);
  
        return updatedItem;
      }
      return item;
    });
  
    setItems(updatedItems);
  };

  const calculateMinPrice = (platform, cost) => {
    const c = parseFloat(cost) || 0;
    const shipping = parseFloat(getShippingCostByPlatform(platform)) || 0;
  
    const desiredProfit = c * 0.1; // 10% profit
    const base = c + shipping + desiredProfit;
  
    switch (platform) {
      case "Poshmark US":
      case "Poshmark CA":
        return (base / 0.8).toFixed(2); // 20% fee
      case "eBay US":
      case "eBay CA":
        return ((base + 0.3) / 0.871).toFixed(2); // 12.9% + $0.30
      case "Shopify":
        return ((base + 0.3) / 0.971).toFixed(2); // 2.9% + $0.30
      case "Etsy":
        return ((base + 0.45) / 0.9).toFixed(2); // 10% + $0.45
      case "Marketplace":
        return base.toFixed(2);
      case "Other":
      default:
        return ""; // let user define manually
    }
  };

  const saveEditedItem = (updatedItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  const getShippingCostByPlatform = (platform) => {
    switch (platform) {
      case "Poshmark US":
        return 1;
      case "Poshmark CA":
      case "Marketplace":
      case "Other":
        return 0;
      case "Etsy":
      case "Shopify":
      case "eBay US":
      case "eBay CA":
        return 14;
      default:
        return 0;
    }
  };

  const calculateFees = (platform, sellingPrice) => {
    const price = parseFloat(sellingPrice) || 0;
  
    switch (platform) {
      case "Poshmark US":
      case "Poshmark CA":
        return (price * 0.2).toFixed(2);
      case "eBay US":
      case "eBay CA":
        return (price * 0.129 + 0.3).toFixed(2);
      case "Shopify":
        return (price * 0.029 + 0.3).toFixed(2);
      case "Etsy":
        return (price * 0.1 + 0.45).toFixed(2);
      case "Marketplace":
        return "0.00";
      default:
        return ""; // For "Other", let user enter manually
    }
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <th>Fees</th>
            <th>Shipping</th>
            <th>Selling Price</th>
            <th>Profit</th>
            <th>Min Price</th>
            <th>Status</th>
            <th>Location</th>
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
                    <select
                      value={item.platform}
                      onChange={(e) => updateItemField(item.id, "platform", e.target.value)}
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
                    <input
                      type="number"
                      value={item.fees || 0}
                      onChange={(e) => updateItemField(item.id, "fees", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.shipping_cost || 0}
                      onChange={(e) => updateItemField(item.id, "shipping_cost", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.sellingPrice || 0}
                      onChange={(e) => updateItemField(item.id, "sellingPrice", e.target.value)}
                    />
                  </td>
                  <td>{calculateProfit(item)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.minimum_selling_price || 0}
                      onChange={(e) => updateItemField(item.id, "minimum_selling_price", e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => updateItemField(item.id, "status", e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/location/${item.location}`}>{item.location}</Link>
                  </td>
                  <td>
                    <div className="button-group">
                      <button className="save" onClick={() => saveEditedItem(item)}>Save</button>
                      <button className="cancel" onClick={() => setEditingItemId(null)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>{item.name}</td>
                  <td>${item.cost}</td>
                  <td>
                    <select
                      value={item.platform}
                      onChange={(e) => updateItemField(item.id, "platform", e.target.value)}
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
                  <td>${item.sellingPrice}</td>
                  <td>{calculateProfit(item)}</td>
                  <td>${item.minimum_selling_price}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => updateItemField(item.id, "status", e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/location/${item.location}`}>{item.location}</Link>
                  </td>
                  <td className="action-buttons">
                    <button className="edit" onClick={() => setEditingItemId(item.id)}>Edit</button>
                    <button className="delete" onClick={() => handleDeleteItem(item.id)}>
                      <img src={TrashIcon} alt="Delete" className="icon-trash" />
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

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
