import HeadNameEditor from "./head-name-editor/HeadNameEditor";

function HeadName({ headId, headName, isEditorOn, onCloseEditor }) {
  return (
    <div className="head-name-wrapper">
      {isEditorOn ? (
        <HeadNameEditor
          headId={headId}
          headName={headName}
          onClose={onCloseEditor}
        />
      ) : (
        <>
          <div className="head-name-text" aria-label={`Head ${headName}`}>
            {headName}
          </div>
        </>
      )}
    </div>
  );
}

export default HeadName;
