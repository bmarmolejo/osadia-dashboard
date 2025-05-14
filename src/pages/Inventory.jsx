import InventoryTable from "../components/InventoryTable";
import "./Inventory.scss"; 

const Inventory = () => {
  return (
    <main className="inventory-page">
      <div className="inventory-container">
        <InventoryTable />
      </div>
    </main>
  );
};

export default Inventory;
