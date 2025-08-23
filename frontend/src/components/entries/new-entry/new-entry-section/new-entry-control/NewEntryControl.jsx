function NewEntryControl() {
  return (
    <div className="new-entry-control">
      <Button type="button" className="new-entry-control-btn" title="Clear all">
        Clear
      </Button>
      <Button
        type="button"
        className="new-entry-control-btn"
        title="Save this entry"
      >
        Save Entry
      </Button>
    </div>
  );
}

export default NewEntryControl;
