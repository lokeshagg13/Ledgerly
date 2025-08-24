import NewEntryTable from "./new-entry-table/NewEntryTable";
import NewEntryHeader from "./new-entry-header/NewEntryHeader";
import NewEntryControl from "./new-entry-control/NewEntryControl";

function NewEntrySection() {
  return (
    <>
      <NewEntryHeader />
      <NewEntryTable />
      <NewEntryControl />
    </>
  );
}

export default NewEntrySection;
