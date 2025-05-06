import React from 'react';
import './InventoryTable.scss';

const InventoryTable = () => {
  const inventoryItems = [
    {
      id: 1,
      name: 'Linen Blouse',
      cost: 12,
      platform: 'eBay',
      location: 'Bin A',
      status: 'Available',
      sellingPrice: 28,
    },
    {
      id: 2,
      name: 'Vintage Bag',
      cost: 8,
      platform: 'Poshmark',
      location: 'Shelf 2',
      status: 'Sold',
      sellingPrice: 35,
    },
  ];

  const calculateProfit = (item) => {
    return item.status === 'Sold' ? (item.sellingPrice - item.cost).toFixed(2) : '-';
  };

  return (
    <div className="inventory-table">
      <div className="inventory-header">
        <h2>Inventory Dashboard</h2>
        <button className="new-item-btn">+ New Item</button>
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
          {inventoryItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.cost}</td>
              <td>{item.platform}</td>
              <td>{item.location}</td>
              <td>{item.status}</td>
              <td>{item.status === 'Sold' ? `$${item.sellingPrice}` : '-'}</td>
              <td>{calculateProfit(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;