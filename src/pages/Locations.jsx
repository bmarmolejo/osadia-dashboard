import LocationsTable from "../components/LocationsTable";
import "./Inventory.scss"; 

const Inventory = () => {
  return (
    <main className="inventory-page">
      <div className="inventory-container">
        <LocationsTable />
      </div>
    </main>
  );
};

export default Inventory;
