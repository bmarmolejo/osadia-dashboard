import SoldTable from "../components/SoldTable";
import "./Inventory.scss"; 

const Inventory = () => {
  return (
    <main className="inventory-page">
      <div className="inventory-container">
        <SoldTable />
      </div>
    </main>
  );
};

export default Inventory;
